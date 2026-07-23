from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Stock(Base):
    """Modelo para Estoque"""
    __tablename__ = "stocks"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    quantity = Column(Integer, default=0, nullable=False)
    warehouse = Column(String(50), default="Principal", nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento
    product = relationship("Product", back_populates="stocks")
    
    def __repr__(self):
        return f"<Stock(id={self.id}, product_id={self.product_id}, quantity={self.quantity})>"
