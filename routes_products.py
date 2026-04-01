from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from database import get_db
from models import Product, Stock
from schemas import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter(prefix="/products", tags=["Products"])


def ensure_stock_record(db: Session, product: Product):
    existing_stock = db.query(Stock).filter(
        Stock.product_id == product.id,
        Stock.warehouse == "Principal"
    ).first()

    if existing_stock:
        return

    db.add(Stock(product_id=product.id, quantity=0, warehouse="Principal"))
    db.commit()


@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """Cria um novo produto."""
    db_product = db.query(Product).filter(Product.sku == product.sku).first()
    if db_product:
        raise HTTPException(status_code=400, detail="SKU ja cadastrado")

    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    ensure_stock_record(db, db_product)
    return db_product


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Obtem um produto pelo ID."""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Produto nao encontrado")

    ensure_stock_record(db, db_product)
    return db_product


@router.get("/", response_model=List[ProductResponse])
def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: str = Query(None),
    category: str = Query(None),
    db: Session = Depends(get_db)
):
    """Lista produtos com filtros e paginacao."""
    query = db.query(Product)

    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.sku.ilike(f"%{search}%")
            )
        )

    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))

    products = query.order_by(Product.id.desc()).offset(skip).limit(limit).all()
    for product in products:
        ensure_stock_record(db, product)

    return products


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza um produto."""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Produto nao encontrado")

    update_data = product.dict(exclude_unset=True)

    if "sku" in update_data:
        existing_product = db.query(Product).filter(
            Product.sku == update_data["sku"],
            Product.id != product_id
        ).first()
        if existing_product:
            raise HTTPException(status_code=400, detail="SKU ja cadastrado")

    for key, value in update_data.items():
        setattr(db_product, key, value)

    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    ensure_stock_record(db, db_product)
    return db_product


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Deleta um produto."""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Produto nao encontrado")

    if db_product.sale_items:
        raise HTTPException(
            status_code=400,
            detail="Nao e possivel deletar produto que foi vendido"
        )

    db.delete(db_product)
    db.commit()
    return {"message": "Produto deletado com sucesso"}


@router.get("/search/by-sku/{sku}", response_model=ProductResponse)
def search_product_by_sku(sku: str, db: Session = Depends(get_db)):
    """Busca produto por SKU."""
    db_product = db.query(Product).filter(Product.sku == sku).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Produto nao encontrado")

    ensure_stock_record(db, db_product)
    return db_product


@router.get("/category/{category}", response_model=List[ProductResponse])
def get_products_by_category(
    category: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtem produtos por categoria."""
    products = (
        db.query(Product)
        .filter(Product.category.ilike(f"%{category}%"))
        .order_by(Product.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    if not products:
        raise HTTPException(status_code=404, detail="Nenhum produto encontrado nesta categoria")

    for product in products:
        ensure_stock_record(db, product)

    return products


@router.post("/{product_id}/duplicate", response_model=ProductResponse)
def duplicate_product(
    product_id: int,
    new_sku: str = Query(..., min_length=1, max_length=50),
    new_name: str = Query(None),
    new_color: str = Query(None),
    new_size: str = Query(None),
    db: Session = Depends(get_db)
):
    """Duplica um produto existente com um novo SKU."""
    original_product = db.query(Product).filter(Product.id == product_id).first()
    if not original_product:
        raise HTTPException(status_code=404, detail="Produto original nao encontrado")

    existing_sku = db.query(Product).filter(Product.sku == new_sku).first()
    if existing_sku:
        raise HTTPException(status_code=400, detail=f"SKU '{new_sku}' ja cadastrado")

    new_product = Product(
        name=new_name if new_name else original_product.name,
        sku=new_sku,
        description=original_product.description,
        category=original_product.category,
        size=new_size if new_size else original_product.size,
        color=new_color if new_color else original_product.color,
        purchase_price=original_product.purchase_price,
        sale_price=original_product.sale_price,
        image_url=original_product.image_url
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    ensure_stock_record(db, new_product)
    return new_product
