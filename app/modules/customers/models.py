from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Customer(Base):
    """Modelo para Clientes"""
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    cpf = Column(String(14), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=True)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String(50), nullable=True)
    state = Column(String(2), nullable=True)
    zip_code = Column(String(10), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento
    sales = relationship("Sale", back_populates="customer", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Customer(id={self.id}, name={self.name}, cpf={self.cpf})>"
