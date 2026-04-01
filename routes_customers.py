from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import get_db
from models import Customer
from schemas import CustomerCreate, CustomerUpdate, CustomerResponse
from typing import List

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.post("/", response_model=CustomerResponse)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    """Cria um novo cliente"""
    # Verifica se o CPF já existe
    db_customer = db.query(Customer).filter(Customer.cpf == customer.cpf).first()
    if db_customer:
        raise HTTPException(status_code=400, detail="CPF já cadastrado")
    
    # Verifica se o email já existe (se fornecido)
    if customer.email:
        db_email = db.query(Customer).filter(Customer.email == customer.email).first()
        if db_email:
            raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    db_customer = Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    """Obtém um cliente pelo ID"""
    db_customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return db_customer


@router.get("/", response_model=List[CustomerResponse])
def list_customers(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query(None),
    db: Session = Depends(get_db)
):
    """Lista clientes com paginação e busca"""
    query = db.query(Customer)
    
    if search:
        # Busca por nome, CPF ou email
        query = query.filter(
            or_(
                Customer.name.ilike(f"%{search}%"),
                Customer.cpf.ilike(f"%{search}%"),
                Customer.email.ilike(f"%{search}%")
            )
        )
    
    return query.order_by(Customer.id.desc()).offset(skip).limit(limit).all()


@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: int,
    customer: CustomerUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza um cliente"""
    db_customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    update_data = customer.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_customer, key, value)
    
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer


@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    """Deleta um cliente"""
    db_customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    # Verifica se o cliente tem vendas
    if db_customer.sales:
        raise HTTPException(
            status_code=400,
            detail="Não é possível deletar cliente com vendas registradas"
        )
    
    db.delete(db_customer)
    db.commit()
    return {"message": "Cliente deletado com sucesso"}


@router.get("/search/by-cpf/{cpf}", response_model=CustomerResponse)
def search_customer_by_cpf(cpf: str, db: Session = Depends(get_db)):
    """Busca cliente por CPF"""
    db_customer = db.query(Customer).filter(Customer.cpf == cpf).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return db_customer
