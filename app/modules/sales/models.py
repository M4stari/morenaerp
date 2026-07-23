from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Sale(Base):
    """Modelo para Vendas"""
    __tablename__ = "sales"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    sale_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    total_amount = Column(Float, default=0, nullable=False)
    status = Column(String(20), default="Pendente", nullable=False)  # Pendente, Parcial, Finalizada, Cancelada
    payment_method = Column(String(30), default="Dinheiro", nullable=False)
    installment_count = Column(Integer, default=1, nullable=False)
    paid_installments = Column(Integer, default=0, nullable=False)
    notes = Column(Text, nullable=True)
    payment_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    customer = relationship("Customer", back_populates="sales")
    sale_items = relationship("SaleItem", back_populates="sale", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Sale(id={self.id}, customer_id={self.customer_id}, total_amount={self.total_amount})>"


class SaleItem(Base):
    """Modelo para Itens de Venda (relacionamento entre Sale e Product)"""
    __tablename__ = "sale_items"
    
    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)
    
    # Relacionamentos
    sale = relationship("Sale", back_populates="sale_items")
    product = relationship("Product", back_populates="sale_items")
    
    def __repr__(self):
        return f"<SaleItem(id={self.id}, sale_id={self.sale_id}, product_id={self.product_id})>"
