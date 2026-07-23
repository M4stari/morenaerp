from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

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
