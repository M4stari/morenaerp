"""
Script para adicionar produtos e estoques ao banco de dados
Produtos da Morena Concept - Blusas e Tops diversos
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Product, Stock
import os
from datetime import datetime

# Conectar ao banco de dados
DATABASE_URL = "sqlite:///./erp_moda.db"
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Dados dos produtos para adicionar
novos_produtos = [
    # ADICIONADOS DO HISTÓRICO
    {
        "name": "Blusa Gola Alta Preto",
        "sku": "BLUSA-GOLA-ALT-PRETO",
        "category": "Blusas",
        "color": "Preto",
        "size": "P/M/G",
        "description": "Blusa com gola alta, material confortável",
        "purchase_price": 35.00,
        "sale_price": 79.9,
        "quantity": 0
    },
    {
        "name": "Blusa Gola Alta Areia",
        "sku": "BLUSA-GOLA-ALT-AREIA",
        "category": "Blusas",
        "color": "Areia",
        "size": "P/M/G",
        "description": "Blusa com gola alta, material confortável",
        "purchase_price": 35.00,
        "sale_price": 79.9,
        "quantity": 0
    },
    {
        "name": "Blusa Gola Alta Off",
        "sku": "BLUSA-GOLA-ALT-OFF",
        "category": "Blusas",
        "color": "Off-White",
        "size": "P/M/G",
        "description": "Blusa com gola alta, material confortável",
        "purchase_price": 35.00,
        "sale_price": 79.9,
        "quantity": 0
    },
    {
        "name": "Ombro-Ombro Manga longa Off",
        "sku": "OMBRO-MANGA-LONGA-OFF",
        "category": "Blusas",
        "color": "Off-White",
        "size": "P/M/G",
        "description": "Blusa ombro-ombro com manga longa",
        "purchase_price": 45.00,
        "sale_price": 99.9,
        "quantity": 0
    },
    {
        "name": "Ombro-Ombro Manga longa Bordo",
        "sku": "OMBRO-MANGA-LONGA-BORDO",
        "category": "Blusas",
        "color": "Bordo",
        "size": "P/M/G",
        "description": "Blusa ombro-ombro com manga longa",
        "purchase_price": 45.00,
        "sale_price": 99.9,
        "quantity": 0
    },
    {
        "name": "Ombro-Ombro Manga longa Preta",
        "sku": "OMBRO-MANGA-LONGA-PRETO",
        "category": "Blusas",
        "color": "Preto",
        "size": "P/M/G",
        "description": "Blusa ombro-ombro com manga longa",
        "purchase_price": 45.00,
        "sale_price": 99.9,
        "quantity": 0
    },
    {
        "name": "Blusa Frente Unica Pescoço Preto",
        "sku": "BLUSA-FRENTE-UNI-PESCO-PRETO",
        "category": "Blusas",
        "color": "Preto",
        "size": "P/M/G",
        "description": "Blusa frente única com detalhe no pescoço",
        "purchase_price": 28.00,
        "sale_price": 59.9,
        "quantity": 5
    },
    {
        "name": "Blusa Frente Unica Pescoço Areia",
        "sku": "BLUSA-FRENTE-UNI-PESCO-AREIA",
        "category": "Blusas",
        "color": "Areia",
        "size": "P/M/G",
        "description": "Blusa frente única com detalhe no pescoço",
        "purchase_price": 28.00,
        "sale_price": 59.9,
        "quantity": 5
    },
    {
        "name": "Blusa Frente Unica Shocker Off",
        "sku": "BLUSA-FRENTE-UNI-SHOCK-OFF",
        "category": "Blusas",
        "color": "Off-White",
        "size": "P/M/G",
        "description": "Blusa frente única com padrão Shocker",
        "purchase_price": 28.00,
        "sale_price": 59.9,
        "quantity": 3
    },
    {
        "name": "Blusa Frente Unica Shocker Preta",
        "sku": "BLUSA-FRENTE-UNI-SHOCK-PRETO",
        "category": "Blusas",
        "color": "Preto",
        "size": "P/M/G",
        "description": "Blusa frente única com padrão Shocker",
        "purchase_price": 28.00,
        "sale_price": 59.9,
        "quantity": 3
    },
    {
        "name": "Top Faixa Tube Shocker Off",
        "sku": "TOP-FAIXA-TUBE-SHOCK-OFF",
        "category": "Tops",
        "color": "Off-White",
        "size": "P/M/G",
        "description": "Top faixa tipo tube com padrão Shocker",
        "purchase_price": 22.00,
        "sale_price": 49.9,
        "quantity": 4
    },
    {
        "name": "Top Faixa Tube Shocker Preto",
        "sku": "TOP-FAIXA-TUBE-SHOCK-PRETO",
        "category": "Tops",
        "color": "Preto",
        "size": "P/M/G",
        "description": "Top faixa tipo tube com padrão Shocker",
        "purchase_price": 22.00,
        "sale_price": 49.9,
        "quantity": 3
    },
    {
        "name": "Top Faixa Tube Shocker Amarelo",
        "sku": "TOP-FAIXA-TUBE-SHOCK-AMAR",
        "category": "Tops",
        "color": "Amarelo",
        "size": "P/M/G",
        "description": "Top faixa tipo tube com padrão Shocker",
        "purchase_price": 22.00,
        "sale_price": 49.9,
        "quantity": 4
    },
    {
        "name": "Top Faixa Tube Shocker Azul",
        "sku": "TOP-FAIXA-TUBE-SHOCK-AZUL",
        "category": "Tops",
        "color": "Azul",
        "size": "P/M/G",
        "description": "Top faixa tipo tube com padrão Shocker",
        "purchase_price": 22.00,
        "sale_price": 49.9,
        "quantity": 3
    },
    {
        "name": "Top Faixa Tube Shocker Azul Marinho",
        "sku": "TOP-FAIXA-TUBE-SHOCK-AZUL-MAR",
        "category": "Tops",
        "color": "Azul Marinho",
        "size": "P/M/G",
        "description": "Top faixa tipo tube com padrão Shocker",
        "purchase_price": 22.00,
        "sale_price": 49.9,
        "quantity": 3
    },
    {
        "name": "Regata Basica Azul Bebe",
        "sku": "REGATA-BAS-AZUL-BEBE",
        "category": "Tops",
        "color": "Azul Bebê",
        "size": "P/M/G",
        "description": "Regata básica em tons claros",
        "purchase_price": 28.00,
        "sale_price": 59.9,
        "quantity": 5
    },
    {
        "name": "Regata Basica Azul Preta",
        "sku": "REGATA-BAS-AZUL-PRETA",
        "category": "Tops",
        "color": "Preto",
        "size": "P/M/G",
        "description": "Regata básica em cores clássicas",
        "purchase_price": 28.00,
        "sale_price": 59.9,
        "quantity": 5
    },
    {
        "name": "Cropped Shocker Preto",
        "sku": "CROPPED-SHOCK-PRETO",
        "category": "Blusas",
        "color": "Preto",
        "size": "P/M/G",
        "description": "Cropped com padrão Shocker",
        "purchase_price": 28.00,
        "sale_price": 59.9,
        "quantity": 4
    },
    {
        "name": "Cropped Shocker Off",
        "sku": "CROPPED-SHOCK-OFF",
        "category": "Blusas",
        "color": "Off-White",
        "size": "P/M/G",
        "description": "Cropped com padrão Shocker",
        "purchase_price": 28.00,
        "sale_price": 59.9,
        "quantity": 3
    },
    {
        "name": "Cropped Shocker Rosa",
        "sku": "CROPPED-SHOCK-ROSA",
        "category": "Blusas",
        "color": "Rosa",
        "size": "P/M/G",
        "description": "Cropped com padrão Shocker",
        "purchase_price": 28.00,
        "sale_price": 59.9,
        "quantity": 3
    },
    {
        "name": "Body Frente Unica Detalhe Manga Vinho",
        "sku": "BODY-FRENTE-UNI-DET-MANGA-VINHO",
        "category": "Bodies",
        "color": "Vinho",
        "size": "P/M/G",
        "description": "Body frente única com detalhe de manga",
        "purchase_price": 0.00,
        "sale_price": 0,
        "quantity": 0
    },
]

print("=" * 70)
print("🛍️  ADICIONANDO PRODUTOS E ESTOQUES AO BANCO DE DADOS")
print("=" * 70)

contador = 0

try:
    for produto_data in novos_produtos:
        # Extrair quantidade (será removida após uso)
        quantity = produto_data.pop("quantity")
        
        # Criar produto
        novo_produto = Product(**produto_data)
        db.add(novo_produto)
        db.flush()  # Para obter o ID gerado
        
        # Criar estoque para este produto
        estoque = Stock(
            product_id=novo_produto.id,
            quantity=quantity
        )
        db.add(estoque)
        
        contador += 1
        print(f"✅ {contador}. {produto_data['name']}")
        print(f"   SKU: {produto_data['sku']} | Qtd: {quantity} | R$ {produto_data['sale_price']}")
        print()
    
    # Confirmar todas as mudanças
    db.commit()
    
    print("=" * 70)
    print(f"✅ SUCESSO! {contador} produtos adicionados ao banco de dados")
    print("=" * 70)
    print()
    print("📊 Resumo:")
    print(f"   • Total de produtos: {contador}")
    print(f"   • Categorias: Blusas, Tops, Bodies")
    print(f"   • Cores diversas: Preto, Off-White, Areia, etc")
    print()
    
except Exception as e:
    db.rollback()
    print(f"❌ ERRO ao adicionar produtos: {str(e)}")
    print("Certifique-se de que o arquivo models.py está correto")
finally:
    db.close()

print("Acesse http://localhost:8000/docs para testar os novos produtos!")
