from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

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
