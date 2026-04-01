from datetime import date, datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload, selectinload

from database import get_db
from models import Customer, Product, Sale, SaleItem, Stock
from schemas import SaleCreate, SaleListResponse, SaleResponse, SaleStatus, SaleUpdate

router = APIRouter(prefix="/sales", tags=["Sales"])


def _normalize_sale_payment_state(db_sale: Sale):
    db_sale.installment_count = max(1, db_sale.installment_count or 1)
    db_sale.paid_installments = max(0, min(db_sale.paid_installments or 0, db_sale.installment_count))

    if db_sale.status == SaleStatus.CANCELADA.value:
        db_sale.paid_at = None
        return db_sale

    if db_sale.paid_installments <= 0:
        db_sale.status = SaleStatus.PENDENTE.value
        db_sale.paid_at = None
    elif db_sale.paid_installments < db_sale.installment_count:
        db_sale.status = SaleStatus.PARCIAL.value
        db_sale.paid_at = None
    else:
        db_sale.status = SaleStatus.FINALIZADA.value
        db_sale.paid_installments = db_sale.installment_count
        db_sale.paid_at = db_sale.paid_at or datetime.utcnow()

    return db_sale


def _build_financial_payload(sales: List[Sale]) -> dict:
    finalized_sales = [
        sale for sale in sales if sale.status == SaleStatus.FINALIZADA.value
    ]
    open_sales = [
        sale for sale in sales if sale.status in {SaleStatus.PENDENTE.value, SaleStatus.PARCIAL.value}
    ]

    total_revenue_paid = sum(
        sale.total_amount * ((sale.paid_installments or 0) / max(1, sale.installment_count or 1))
        for sale in sales
        if sale.status != SaleStatus.CANCELADA.value
    )
    total_receivable_pending = sum(
        sale.total_amount - (
            sale.total_amount * ((sale.paid_installments or 0) / max(1, sale.installment_count or 1))
        )
        for sale in open_sales
    )
    average_ticket_paid = (
        total_revenue_paid / len(finalized_sales) if finalized_sales else 0
    )
    average_ticket_overall = (
        sum(sale.total_amount for sale in sales) / len(sales) if sales else 0
    )

    paid_profit = 0
    for sale in sales:
        if sale.status == SaleStatus.CANCELADA.value:
            continue

        paid_ratio = (sale.paid_installments or 0) / max(1, sale.installment_count or 1)
        if paid_ratio <= 0:
            continue

        for item in sale.sale_items:
            purchase_price = item.product.purchase_price if item.product else 0
            paid_profit += ((item.unit_price - purchase_price) * item.quantity) * paid_ratio

    unpaid_items = []
    for sale in open_sales:
        paid_ratio = (sale.paid_installments or 0) / max(1, sale.installment_count or 1)
        received_amount = sale.total_amount * paid_ratio
        remaining_amount = max(0, sale.total_amount - received_amount)
        for item in sale.sale_items:
            unpaid_items.append(
                {
                    "sale_id": sale.id,
                    "sale_date": sale.sale_date,
                    "customer_id": sale.customer_id,
                    "customer_name": sale.customer.name if sale.customer else "Cliente desconhecido",
                    "product_id": item.product_id,
                    "product_name": item.product.name if item.product else "Produto desconhecido",
                    "quantity": item.quantity,
                    "unit_price": item.unit_price,
                    "subtotal": item.subtotal,
                    "status": sale.status,
                    "payment_method": sale.payment_method,
                    "installment_count": sale.installment_count,
                    "paid_installments": sale.paid_installments,
                    "remaining_installments": max(0, sale.installment_count - sale.paid_installments),
                    "received_amount": received_amount,
                    "remaining_amount": remaining_amount,
                    "due_date": sale.due_date,
                    "payment_notes": sale.payment_notes,
                    "days_overdue": (
                        (date.today() - sale.due_date.date()).days
                        if sale.due_date and sale.due_date.date() < date.today()
                        else 0
                    ),
                }
            )

    top_products = {}
    for sale in finalized_sales:
        for item in sale.sale_items:
            product_name = item.product.name if item.product else "Produto desconhecido"
            if product_name not in top_products:
                top_products[product_name] = {"quantity": 0, "revenue": 0}
            top_products[product_name]["quantity"] += item.quantity
            top_products[product_name]["revenue"] += item.subtotal

    best_sellers = sorted(
        [
            {
                "product_name": name,
                "quantity": data["quantity"],
                "revenue": data["revenue"],
            }
            for name, data in top_products.items()
        ],
        key=lambda item: (item["quantity"], item["revenue"]),
        reverse=True,
    )[:5]

    return {
        "totals": {
            "total_revenue_paid": total_revenue_paid,
            "total_receivable_pending": total_receivable_pending,
            "average_ticket_paid": average_ticket_paid,
            "average_ticket_overall": average_ticket_overall,
            "finalized_sales_count": len(finalized_sales),
            "pending_sales_count": len(open_sales),
            "gross_profit_paid": paid_profit,
        },
        "pending_items": unpaid_items,
        "best_sellers": best_sellers,
    }


@router.get("/report/dashboard-summary", response_model=dict)
def get_dashboard_summary(
    latest_sales_limit: int = Query(8, ge=1, le=20),
    db: Session = Depends(get_db),
):
    """Retorna todos os dados principais do dashboard em uma unica chamada."""
    from sqlalchemy import func

    sales = (
        db.query(Sale)
        .options(
            joinedload(Sale.customer),
            selectinload(Sale.sale_items).joinedload(SaleItem.product),
        )
        .order_by(Sale.sale_date.desc())
        .all()
    )

    financial_payload = _build_financial_payload(sales)
    latest_sales = sales[:latest_sales_limit]

    total_customers = db.query(func.count(Customer.id)).scalar() or 0
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_quantity = db.query(func.coalesce(func.sum(Stock.quantity), 0)).scalar() or 0

    return {
        "summary": {
            "customers": total_customers,
            "products": total_products,
            "totalQuantity": total_quantity,
        },
        "financial": financial_payload["totals"],
        "pending_items": financial_payload["pending_items"],
        "best_sellers": financial_payload["best_sellers"],
        "latest_sales": latest_sales,
    }


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
        due_date=sale.due_date,
        payment_method=sale.payment_method,
        installment_count=sale.installment_count,
        paid_installments=0,
        payment_notes=sale.payment_notes,
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
    _normalize_sale_payment_state(db_sale)
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    return db_sale


@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    """Obtem uma venda pelo ID."""
    db_sale = (
        db.query(Sale)
        .options(
            joinedload(Sale.customer),
            selectinload(Sale.sale_items).joinedload(SaleItem.product),
        )
        .filter(Sale.id == sale_id)
        .first()
    )
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
    query = db.query(Sale).options(
        joinedload(Sale.customer),
        selectinload(Sale.sale_items).joinedload(SaleItem.product),
    )

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

    if "status" in update_data and db_sale.status == SaleStatus.CANCELADA.value:
        db_sale.paid_at = None
    else:
        _normalize_sale_payment_state(db_sale)

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

    if db_sale.status not in {SaleStatus.PENDENTE.value, SaleStatus.PARCIAL.value}:
        raise HTTPException(
            status_code=400,
            detail="Apenas vendas em aberto podem ser deletadas",
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
        .options(
            joinedload(Sale.customer),
            selectinload(Sale.sale_items).joinedload(SaleItem.product),
        )
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
    db_sale.paid_at = None
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
    """Quita todas as parcelas restantes de uma venda."""
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

    db_sale.paid_installments = db_sale.installment_count
    _normalize_sale_payment_state(db_sale)
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    return {
        "message": "Venda finalizada com sucesso",
        "sale_id": sale_id,
        "status": SaleStatus.FINALIZADA.value,
        "total_amount": db_sale.total_amount,
    }


@router.post("/{sale_id}/pay-installment")
def pay_installment(
    sale_id: int,
    quantity: int = Query(1, ge=1, le=24),
    db: Session = Depends(get_db),
):
    """Quita uma ou mais parcelas de uma venda."""
    db_sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Venda nao encontrada")

    if db_sale.status == SaleStatus.CANCELADA.value:
        raise HTTPException(status_code=400, detail="Nao e possivel quitar parcelas de uma venda cancelada")

    if db_sale.status == SaleStatus.FINALIZADA.value:
        raise HTTPException(status_code=400, detail="Todas as parcelas desta venda ja foram quitadas")

    remaining_installments = max(0, db_sale.installment_count - db_sale.paid_installments)
    if quantity > remaining_installments:
        raise HTTPException(
            status_code=400,
            detail=f"Restam apenas {remaining_installments} parcela(s) para quitar nesta venda",
        )

    db_sale.paid_installments += quantity
    _normalize_sale_payment_state(db_sale)
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    return {
        "message": "Parcela quitada com sucesso",
        "sale_id": sale_id,
        "status": db_sale.status,
        "paid_installments": db_sale.paid_installments,
        "installment_count": db_sale.installment_count,
        "remaining_installments": max(0, db_sale.installment_count - db_sale.paid_installments),
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


@router.get("/report/financial", response_model=dict)
def get_financial_report(db: Session = Depends(get_db)):
    """Retorna um resumo financeiro com valores recebidos e pendentes."""
    sales = (
        db.query(Sale)
        .options(
            joinedload(Sale.customer),
            selectinload(Sale.sale_items).joinedload(SaleItem.product),
        )
        .order_by(Sale.sale_date.desc())
        .all()
    )
    return _build_financial_payload(sales)


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
