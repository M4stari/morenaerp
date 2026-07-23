from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.modules.customers.schemas import CustomerResponse
from app.modules.products.schemas import ProductResponse

# ================== SALE ITEM SCHEMAS ==================

class SaleItemBase(BaseModel):
    """Schema base para Item de Venda"""
    product_id: int
    quantity: int = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)


class SaleItemCreate(BaseModel):
    """Schema para criar Item de Venda"""
    product_id: int
    quantity: int = Field(..., gt=0)


class SaleItemResponse(BaseModel):
    """Schema para resposta de Item de Venda"""
    id: int
    product_id: int
    quantity: int
    unit_price: float
    subtotal: float
    product: ProductResponse
    
    class Config:
        from_attributes = True


# ================== SALE SCHEMAS ==================

class SaleBase(BaseModel):
    """Schema base para Venda"""
    customer_id: int
    notes: Optional[str] = None
    due_date: Optional[datetime] = None
    payment_method: str = Field(default="Dinheiro", min_length=1, max_length=30)
    installment_count: int = Field(default=1, ge=1, le=24)
    payment_notes: Optional[str] = None


class SaleCreate(SaleBase):
    """Schema para criar Venda com itens"""
    items: List[SaleItemCreate] = Field(..., min_items=1)


class SaleStatus(str, Enum):
    PENDENTE = "Pendente"
    PARCIAL = "Parcial"
    FINALIZADA = "Finalizada"
    CANCELADA = "Cancelada"


class SaleUpdate(BaseModel):
    """Schema para atualizar Venda"""
    status: Optional[SaleStatus] = None
    notes: Optional[str] = None
    due_date: Optional[datetime] = None
    payment_method: Optional[str] = Field(default=None, min_length=1, max_length=30)
    installment_count: Optional[int] = Field(default=None, ge=1, le=24)
    paid_installments: Optional[int] = Field(default=None, ge=0, le=24)
    payment_notes: Optional[str] = None


class SaleResponse(BaseModel):
    """Schema para resposta de Venda"""
    id: int
    customer_id: int
    customer: CustomerResponse
    sale_date: datetime
    due_date: Optional[datetime]
    paid_at: Optional[datetime]
    total_amount: float
    status: str
    payment_method: str
    installment_count: int
    paid_installments: int
    notes: Optional[str]
    payment_notes: Optional[str]
    sale_items: List[SaleItemResponse]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class SaleListResponse(BaseModel):
    """Schema para listar Vendas (sem itens detalhados)"""
    id: int
    customer_id: int
    customer: CustomerResponse
    sale_date: datetime
    due_date: Optional[datetime]
    paid_at: Optional[datetime]
    total_amount: float
    status: str
    payment_method: str
    installment_count: int
    paid_installments: int
    notes: Optional[str]
    payment_notes: Optional[str]
    sale_items: List[SaleItemResponse]
    
    class Config:
        from_attributes = True
