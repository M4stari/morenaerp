from datetime import date
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models import Customer, Product, Sale, SaleItem, Stock
from schemas import SaleCreate, SaleListResponse, SaleResponse, SaleStatus, SaleUpdate

router = APIRouter(prefix="/sales", tags=["Sales"])


@router.post("/", response_model=SaleResponse)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    """Cria uma nova venda com itens."""
    customer = db.query(Customer).filter(Customer.id == sale.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente nao encontrado")

    db_sale = Sale(
        customer_id=sale.customer_id,
        status=SaleStatus.PENDENTE.value,
        notes=sale.notes,
    )

    total_amount = 0

    for item in sale.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Produto ID {item.product_id} nao encontrado",
            )

        stock = db.query(Stock).filter(Stock.product_id == item.product_id).first()
        if not stock or stock.quantity < item.quantity:
            available = stock.quantity if stock else 0
            raise HTTPException(
                status_code=400,
                detail=f"Estoque insuficiente para produto {product.name}. Disponivel: {available}",
            )

        subtotal = product.sale_price * item.quantity
        total_amount += subtotal

        sale_item = SaleItem(
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=product.sale_price,
            subtotal=subtotal,
        )
        db_sale.sale_items.append(sale_item)

        stock.quantity -= item.quantity
        db.add(stock)

    db_sale.total_amount = total_amount
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    return db_sale


@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    """Obtem uma venda pelo ID."""
    db_sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Venda nao encontrada")
    return db_sale


@router.get("/", response_model=List[SaleListResponse])
def list_sales(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    customer_id: int = Query(None),
    status: str = Query(None),
    db: Session = Depends(get_db),
):
    """Lista vendas com filtros e paginacao."""
    query = db.query(Sale)

    if customer_id:
        query = query.filter(Sale.customer_id == customer_id)

    if status:
        query = query.filter(Sale.status == status)

    return query.order_by(Sale.sale_date.desc()).offset(skip).limit(limit).all()


@router.put("/{sale_id}", response_model=SaleResponse)
def update_sale(
    sale_id: int,
    sale: SaleUpdate,
    db: Session = Depends(get_db),
):
    """Atualiza status ou notas de uma venda."""
    db_sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Venda nao encontrada")

    update_data = sale.dict(exclude_unset=True)
    for key, value in update_data.items():
        if isinstance(value, SaleStatus):
            value = value.value
        setattr(db_sale, key, value)

    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale


@router.delete("/{sale_id}")
def delete_sale(sale_id: int, db: Session = Depends(get_db)):
    """Deleta uma venda pendente e retorna estoque."""
    db_sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Venda nao encontrada")

    if db_sale.status != SaleStatus.PENDENTE.value:
        raise HTTPException(
            status_code=400,
            detail="Apenas vendas pendentes podem ser deletadas",
        )

    for item in db_sale.sale_items:
        stock = db.query(Stock).filter(Stock.product_id == item.product_id).first()
        if stock:
            stock.quantity += item.quantity
            db.add(stock)

    db.delete(db_sale)
    db.commit()

    return {"message": "Venda cancelada e estoque restaurado"}


@router.get("/customer/{customer_id}", response_model=List[SaleListResponse])
def get_sales_by_customer(
    customer_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Obtem todas as vendas de um cliente."""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente nao encontrado")

    return (
        db.query(Sale)
        .filter(Sale.customer_id == customer_id)
        .order_by(Sale.sale_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.post("/{sale_id}/cancel")
def cancel_sale(sale_id: int, db: Session = Depends(get_db)):
    """Cancela uma venda pendente e retorna produtos ao estoque."""
    db_sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Venda nao encontrada")

    if db_sale.status == SaleStatus.CANCELADA.value:
        raise HTTPException(status_code=400, detail="Venda ja foi cancelada")

    if db_sale.status == SaleStatus.FINALIZADA.value:
        raise HTTPException(
            status_code=400,
            detail="Nao e possivel cancelar uma venda ja finalizada",
        )

    for item in db_sale.sale_items:
        stock = db.query(Stock).filter(Stock.product_id == item.product_id).first()
        if stock:
            stock.quantity += item.quantity
            db.add(stock)

    db_sale.status = SaleStatus.CANCELADA.value
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    return {
        "message": "Venda cancelada com sucesso",
        "sale_id": sale_id,
        "status": SaleStatus.CANCELADA.value,
    }


@router.post("/{sale_id}/finalize")
def finalize_sale(sale_id: int, db: Session = Depends(get_db)):
    """Finaliza uma venda."""
    db_sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Venda nao encontrada")

    if db_sale.status == SaleStatus.FINALIZADA.value:
        raise HTTPException(status_code=400, detail="Venda ja foi finalizada")

    if db_sale.status == SaleStatus.CANCELADA.value:
        raise HTTPException(
            status_code=400,
            detail="Nao e possivel finalizar venda cancelada",
        )

    db_sale.status = SaleStatus.FINALIZADA.value
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    return {
        "message": "Venda finalizada com sucesso",
        "sale_id": sale_id,
        "status": SaleStatus.FINALIZADA.value,
        "total_amount": db_sale.total_amount,
    }


@router.get("/report/daily", response_model=dict)
def get_daily_report(
    report_date: date | None = Query(default=None, alias="date"),
    db: Session = Depends(get_db),
):
    """Gera relatorio de vendas do dia."""
    from sqlalchemy import func

    target_date = report_date or date.today()
    daily_sales = db.query(Sale).filter(func.date(Sale.sale_date) == target_date).all()

    total_sales = sum(sale.total_amount for sale in daily_sales)
    total_items = sum(len(sale.sale_items) for sale in daily_sales)

    return {
        "date": target_date,
        "total_sales": len(daily_sales),
        "total_amount": total_sales,
        "total_items": total_items,
        "average_sale": total_sales / len(daily_sales) if daily_sales else 0,
    }


@router.get("/report/by-customer", response_model=dict)
def get_sales_by_customer_report(db: Session = Depends(get_db)):
    """Gera relatorio de vendas agrupadas por cliente."""
    from sqlalchemy import func

    result = (
        db.query(
            Customer.id,
            Customer.name,
            func.count(Sale.id).label("total_sales"),
            func.sum(Sale.total_amount).label("total_amount"),
        )
        .join(Sale)
        .group_by(Customer.id, Customer.name)
        .all()
    )

    return {
        "report": [
            {
                "customer_id": row[0],
                "customer_name": row[1],
                "total_sales": row[2],
                "total_amount": row[3],
            }
            for row in result
        ]
    }
