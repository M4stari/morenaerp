from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models import Stock, Product
from schemas import StockCreate, StockUpdate, StockResponse, ProductUpdate, ProductResponse
from typing import List

router = APIRouter(prefix="/stocks", tags=["Stocks"])


@router.post("/", response_model=StockResponse)
def create_stock(stock: StockCreate, db: Session = Depends(get_db)):
    """Cria um novo registro de estoque"""
    # Verifica se o produto existe
    product = db.query(Product).filter(Product.id == stock.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # Verifica se já existe estoque para este produto e warehouse
    existing_stock = db.query(Stock).filter(
        Stock.product_id == stock.product_id,
        Stock.warehouse == stock.warehouse
    ).first()
    
    if existing_stock:
        raise HTTPException(
            status_code=400,
            detail="Já existe estoque registrado para este produto neste warehouse"
        )
    
    db_stock = Stock(**stock.dict())
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock


@router.get("/{stock_id}", response_model=StockResponse)
def get_stock(stock_id: int, db: Session = Depends(get_db)):
    """Obtém um registro de estoque pelo ID"""
    db_stock = (
        db.query(Stock)
        .options(joinedload(Stock.product))
        .filter(Stock.id == stock_id)
        .first()
    )
    if not db_stock:
        raise HTTPException(status_code=404, detail="Estoque não encontrado")
    return db_stock


@router.get("/", response_model=List[StockResponse])
def list_stocks(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    product_id: int = Query(None),
    warehouse: str = Query(None),
    db: Session = Depends(get_db)
):
    """Lista estoques com filtros"""
    query = db.query(Stock).options(joinedload(Stock.product))
    
    if product_id:
        query = query.filter(Stock.product_id == product_id)
    
    if warehouse:
        query = query.filter(Stock.warehouse.ilike(f"%{warehouse}%"))
    
    return query.order_by(Stock.id.desc()).offset(skip).limit(limit).all()


@router.put("/{stock_id}", response_model=StockResponse)
def update_stock(
    stock_id: int,
    stock: StockUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza a quantidade de estoque"""
    db_stock = db.query(Stock).filter(Stock.id == stock_id).first()
    if not db_stock:
        raise HTTPException(status_code=404, detail="Estoque não encontrado")
    
    update_data = stock.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_stock, key, value)
    
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock


@router.get("/product/{product_id}", response_model=List[StockResponse])
def get_stock_by_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Obtém todos os estoques de um produto"""
    # Verifica se o produto existe
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    stocks = (
        db.query(Stock)
        .options(joinedload(Stock.product))
        .filter(Stock.product_id == product_id)
        .all()
    )
    return stocks


@router.post("/add/{stock_id}")
def add_quantity(
    stock_id: int,
    quantity: int = Query(..., gt=0),
    reason: str = Query(default="Reposição"),
    db: Session = Depends(get_db)
):
    """Adiciona quantidade ao estoque"""
    db_stock = db.query(Stock).filter(Stock.id == stock_id).first()
    if not db_stock:
        raise HTTPException(status_code=404, detail="Estoque não encontrado")
    
    db_stock.quantity += quantity
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    
    return {
        "message": "Quantidade adicionada com sucesso",
        "product_id": db_stock.product_id,
        "new_quantity": db_stock.quantity,
        "reason": reason
    }


@router.post("/remove/{stock_id}")
def remove_quantity(
    stock_id: int,
    quantity: int = Query(..., gt=0),
    reason: str = Query(default="Venda"),
    db: Session = Depends(get_db)
):
    """Remove quantidade do estoque"""
    db_stock = db.query(Stock).filter(Stock.id == stock_id).first()
    if not db_stock:
        raise HTTPException(status_code=404, detail="Estoque não encontrado")
    
    if db_stock.quantity < quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Quantidade insuficiente. Disponível: {db_stock.quantity}"
        )
    
    db_stock.quantity -= quantity
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    
    return {
        "message": "Quantidade removida com sucesso",
        "product_id": db_stock.product_id,
        "new_quantity": db_stock.quantity,
        "reason": reason
    }


@router.get("/available/all", response_model=List[StockResponse])
def get_available_stocks(
    min_quantity: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Obtém estoques com quantidade mínima especificada"""
    stocks = (
        db.query(Stock)
        .options(joinedload(Stock.product))
        .filter(Stock.quantity >= min_quantity)
        .all()
    )
    return stocks


@router.get("/low-stock/", response_model=List[StockResponse])
def get_low_stock(
    threshold: int = Query(5, gt=0),
    db: Session = Depends(get_db)
):
    """Obtém produtos com estoque baixo"""
    stocks = (
        db.query(Stock)
        .options(joinedload(Stock.product))
        .filter(Stock.quantity <= threshold)
        .all()
    )
    return stocks


@router.put("/product/{product_id}/edit", response_model=dict)
def edit_product_from_stock(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db)
):
    """Edita todos os dados do produto através da manutenção de estoque"""
    # Verifica se o produto existe
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # Atualiza apenas os campos fornecidos
    update_data = product_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return {
        "message": "Dados do produto atualizados com sucesso",
        "product_id": db_product.id,
        "product_name": db_product.name,
        "product_sku": db_product.sku,
        "purchase_price": db_product.purchase_price,
        "sale_price": db_product.sale_price,
        "image_url": db_product.image_url,
        "category": db_product.category,
        "size": db_product.size,
        "color": db_product.color
    }


@router.get("/product/{product_id}/details", response_model=dict)
def get_product_details_from_stock(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Obtém detalhes completos do produto através da manutenção de estoque"""
    # Verifica se o produto existe
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # Obtém total de estoque do produto em todos os warehouses
    total_quantity = sum(stock.quantity for stock in db_product.stocks)
    
    return {
        "id": db_product.id,
        "name": db_product.name,
        "sku": db_product.sku,
        "description": db_product.description,
        "category": db_product.category,
        "size": db_product.size,
        "color": db_product.color,
        "purchase_price": db_product.purchase_price,
        "sale_price": db_product.sale_price,
        "image_url": db_product.image_url,
        "total_quantity": total_quantity,
        "profit_per_item": db_product.sale_price - db_product.purchase_price,
        "profit_margin_percent": (
            ((db_product.sale_price - db_product.purchase_price) / db_product.purchase_price * 100)
            if db_product.purchase_price
            else 0
        ),
        "created_at": db_product.created_at,
        "updated_at": db_product.updated_at
    }
