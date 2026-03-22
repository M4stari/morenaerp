from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# ================== CUSTOMER SCHEMAS ==================

class CustomerBase(BaseModel):
    """Schema base para Cliente"""
    name: str = Field(..., min_length=3, max_length=100)
    cpf: str = Field(..., min_length=11, max_length=14)
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None


class CustomerCreate(CustomerBase):
    """Schema para criar Cliente"""
    pass


class CustomerUpdate(BaseModel):
    """Schema para atualizar Cliente"""
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None


class CustomerResponse(CustomerBase):
    """Schema para resposta de Cliente"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ================== PRODUCT SCHEMAS ==================

class ProductBase(BaseModel):
    """Schema base para Produto"""
    name: str = Field(..., min_length=3, max_length=150)
    sku: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    category: str = Field(..., min_length=1, max_length=50)
    size: str = Field(..., min_length=1, max_length=10)
    color: Optional[str] = None
    purchase_price: float = Field(..., ge=0)
    sale_price: float = Field(..., ge=0)
    image_url: Optional[str] = None


class ProductCreate(ProductBase):
    """Schema para criar Produto"""
    pass


class ProductUpdate(BaseModel):
    """Schema para atualizar Produto"""
    name: Optional[str] = None
    sku: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None
    purchase_price: Optional[float] = None
    sale_price: Optional[float] = None
    image_url: Optional[str] = None


class ProductResponse(ProductBase):
    """Schema para resposta de Produto"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ================== STOCK SCHEMAS ==================

class StockBase(BaseModel):
    """Schema base para Estoque"""
    product_id: int
    quantity: int = Field(..., ge=0)
    warehouse: str = Field(default="Principal", max_length=50)


class StockCreate(StockBase):
    """Schema para criar Estoque"""
    pass


class StockUpdate(BaseModel):
    """Schema para atualizar quantidade em Estoque"""
    quantity: int = Field(..., ge=0)
    warehouse: Optional[str] = None


class StockResponse(StockBase):
    """Schema para resposta de Estoque"""
    id: int
    product: ProductResponse
    last_updated: datetime
    
    class Config:
        from_attributes = True


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
    payment_notes: Optional[str] = None


class SaleCreate(SaleBase):
    """Schema para criar Venda com itens"""
    items: List[SaleItemCreate] = Field(..., min_items=1)


class SaleStatus(str, Enum):
    PENDENTE = "Pendente"
    FINALIZADA = "Finalizada"
    CANCELADA = "Cancelada"


class SaleUpdate(BaseModel):
    """Schema para atualizar Venda"""
    status: Optional[SaleStatus] = None
    notes: Optional[str] = None
    due_date: Optional[datetime] = None
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
    sale_date: datetime
    due_date: Optional[datetime]
    paid_at: Optional[datetime]
    total_amount: float
    status: str
    payment_notes: Optional[str]
    
    class Config:
        from_attributes = True
