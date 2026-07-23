from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.modules.products.schemas import ProductResponse

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
