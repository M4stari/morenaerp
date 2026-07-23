from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Product(Base):
    """Modelo para Produtos"""
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    sku = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False)  # Exemplo: Blusas, Calças, Vestidos, etc.
    size = Column(String(10), nullable=False)  # P, M, G, GG, etc.
    color = Column(String(30), nullable=True)
    purchase_price = Column(Float, nullable=False)
    sale_price = Column(Float, nullable=False)
    image_url = Column(Text, nullable=True)  # URL da imagem ou base64
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    stocks = relationship("Stock", back_populates="product", cascade="all, delete-orphan")
    sale_items = relationship("SaleItem", back_populates="product", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Product(id={self.id}, name={self.name}, sku={self.sku})>"
