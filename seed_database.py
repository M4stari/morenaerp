"""
Script para popular o banco de dados com dados de teste
Execute: python seed_database.py
"""

from database import SessionLocal, init_db
from models import Customer, Product, Stock, Sale, SaleItem
from datetime import datetime, timedelta
import random

# Inicializar banco de dados
init_db()

# Obter sessão
db = SessionLocal()

try:
    # ========================================================================
    # LIMPAR DADOS EXISTENTES (Opcional - descomente para limpar)
    # ========================================================================
    # db.query(SaleItem).delete()
    # db.query(Sale).delete()
    # db.query(Stock).delete()
    # db.query(Customer).delete()
    # db.query(Product).delete()
    # db.commit()
    
    # ========================================================================
    # CRIAR CLIENTES
    # ========================================================================
    clientes = [
        Customer(
            name="Ana Silva Santos",
            cpf="12345678901",
            email="ana.silva@email.com",
            phone="11987654321",
            address="Av. Paulista, 1000",
            city="São Paulo",
            state="SP",
            zip_code="01310-100"
        ),
        Customer(
            name="Maria Oliveira Costa",
            cpf="98765432101",
            email="maria.costa@email.com",
            phone="11988888888",
            address="Rua dos Pinheiros, 500",
            city="São Paulo",
            state="SP",
            zip_code="02101-050"
        ),
        Customer(
            name="João Santos Pereira",
            cpf="55555555555",
            email="joao.pereira@email.com",
            phone="11999999999",
            address="Av. Brasil, 2000",
            city="Rio de Janeiro",
            state="RJ",
            zip_code="20040020"
        ),
        Customer(
            name="Fernanda Mendes",
            cpf="66666666666",
            email="fernanda.mendes@email.com",
            phone="21987654321",
            address="Rua das Flores, 300",
            city="Rio de Janeiro",
            state="RJ",
            zip_code="20050-030"
        ),
        Customer(
            name="Carlos Almeida Gomes",
            cpf="77777777777",
            email="carlos.almeida@email.com",
            phone="31999999999",
            address="Rua Getúlio Vargas, 150",
            city="Belo Horizonte",
            state="MG",
            zip_code="30140-071"
        )
    ]
    
    db.add_all(clientes)
    db.commit()
    print(f"✅ {len(clientes)} clientes criados")
    
    # ========================================================================
    # CRIAR PRODUTOS
    # ========================================================================
    produtos = [
        # Blusas
        Product(
            name="Blusa Básica Branca",
            sku="BLUSA-BAS-001",
            description="Blusa de algodão básica",
            category="Blusas",
            size="P",
            color="Branco",
            purchase_price=20.00,
            sale_price=49.90,
            image_url="https://via.placeholder.com/300x300?text=Blusa+Basica+Branca"
        ),
        Product(
            name="Blusa Estampada Floral",
            sku="BLUSA-EST-001",
            description="Blusa com estampa floral",
            category="Blusas",
            size="M",
            color="Multicolor",
            purchase_price=25.00,
            sale_price=59.90,
            image_url="https://via.placeholder.com/300x300?text=Blusa+Estampada"
        ),
        Product(
            name="Blusa Social Vermelha",
            sku="BLUSA-SOC-001",
            description="Blusa social para ambientes corporativos",
            category="Blusas",
            size="G",
            color="Vermelho",
            purchase_price=35.00,
            sale_price=99.90,
            image_url="https://via.placeholder.com/300x300?text=Blusa+Social+Vermelha"
        ),
        
        # Calças
        Product(
            name="Calça Jeans Skinny",
            sku="CALCA-JEA-001",
            description="Calça jeans ajustada",
            category="Calças",
            size="P",
            color="Azul Escuro",
            purchase_price=40.00,
            sale_price=119.90,
            image_url="https://via.placeholder.com/300x300?text=Calca+Jeans+Skinny"
        ),
        Product(
            name="Calça Denim Reta",
            sku="CALCA-DEN-001",
            description="Calça denim clássica",
            category="Calças",
            size="M",
            color="Azul Claro",
            purchase_price=45.00,
            sale_price=129.90,
            image_url="https://via.placeholder.com/300x300?text=Calca+Denim+Reta"
        ),
        Product(
            name="Legging Fitness",
            sku="LEGGING-FIT-001",
            description="Legging para atividades físicas",
            category="Calças",
            size="G",
            color="Preto",
            purchase_price=30.00,
            sale_price=89.90,
            image_url="https://via.placeholder.com/300x300?text=Legging+Fitness"
        ),
        
        # Vestidos
        Product(
            name="Vestido Casual Listrado",
            sku="VESTIDO-CAS-001",
            description="Vestido casual para dia",
            category="Vestidos",
            size="P",
            color="Branco e Azul",
            purchase_price=50.00,
            sale_price=149.90,
            image_url="https://via.placeholder.com/300x300?text=Vestido+Casual"
        ),
        Product(
            name="Vestido Midi Floral",
            sku="VESTIDO-MID-001",
            description="Vestido midi elegante",
            category="Vestidos",
            size="M",
            color="Rosa",
            purchase_price=60.00,
            sale_price=179.90,
            image_url="https://via.placeholder.com/300x300?text=Vestido+Midi+Floral"
        ),
        Product(
            name="Vestido Festa Preto",
            sku="VESTIDO-FES-001",
            description="Vestido para festas e eventos",
            category="Vestidos",
            size="G",
            color="Preto",
            purchase_price=80.00,
            sale_price=249.90,
            image_url="https://via.placeholder.com/300x300?text=Vestido+Festa+Preto"
        ),
        
        # Acessórios
        Product(
            name="Bolsa Tote de Lona",
            sku="BOLSA-TOT-001",
            description="Bolsa tote em lona",
            category="Acessórios",
            size="Único",
            color="Bege",
            purchase_price=25.00,
            sale_price=79.90,
            image_url="https://via.placeholder.com/300x300?text=Bolsa+Tote+Lona"
        ),
        Product(
            name="Cinto Couro Preto",
            sku="CINTO-COL-001",
            description="Cinto de couro genuíno",
            category="Acessórios",
            size="Único",
            color="Preto",
            purchase_price=30.00,
            sale_price=99.90,
            image_url="https://via.placeholder.com/300x300?text=Cinto+Couro+Preto"
        ),
    ]
    
    db.add_all(produtos)
    db.commit()
    print(f"✅ {len(produtos)} produtos criados")
    
    # ========================================================================
    # CRIAR ESTOQUES
    # ========================================================================
    estoques = []
    for produto in produtos:
        estoque = Stock(
            product_id=produto.id,
            quantity=random.randint(10, 100),
            warehouse="Principal"
        )
        estoques.append(estoque)
    
    db.add_all(estoques)
    db.commit()
    print(f"✅ {len(estoques)} registros de estoque criados")
    
    # ========================================================================
    # CRIAR VENDAS DE TESTE
    # ========================================================================
    vendas_criadas = 0
    for cliente in clientes[:3]:  # Cria vendas para os 3 primeiros clientes
        for i in range(random.randint(1, 3)):  # 1-3 vendas por cliente
            venda = Sale(
                customer_id=cliente.id,
                status="Finalizada",
                sale_date=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
                notes=f"Venda de teste {i+1}"
            )
            
            # Adiciona 1-3 itens por venda
            total = 0
            for j in range(random.randint(1, 3)):
                produto = random.choice(produtos)
                quantidade = random.randint(1, 5)
                subtotal = produto.sale_price * quantidade
                total += subtotal
                
                item = SaleItem(
                    product_id=produto.id,
                    quantity=quantidade,
                    unit_price=produto.sale_price,
                    subtotal=subtotal
                )
                venda.sale_items.append(item)
            
            venda.total_amount = total
            db.add(venda)
            vendas_criadas += 1
    
    db.commit()
    print(f"✅ {vendas_criadas} vendas criadas")
    
    # ========================================================================
    # RESUMO
    # ========================================================================
    print("\n" + "="*70)
    print("RESUMO DO BANCO DE DADOS")
    print("="*70)
    
    num_clientes = db.query(Customer).count()
    num_produtos = db.query(Product).count()
    num_estoques = db.query(Stock).count()
    num_vendas = db.query(Sale).count()
    num_itens = db.query(SaleItem).count()
    
    print(f"Clientes: {num_clientes}")
    print(f"Produtos: {num_produtos}")
    print(f"Estoques: {num_estoques}")
    print(f"Vendas: {num_vendas}")
    print(f"Itens de Venda: {num_itens}")
    print("="*70)
    
    # ========================================================================
    # ESTATÍSTICAS
    # ========================================================================
    print("\nESTATÍSTICAS:")
    
    total_vendido = db.query(Sale).filter(Sale.status == "Finalizada").count()
    valor_total = sum(s.total_amount for s in db.query(Sale).filter(Sale.status == "Finalizada").all())
    
    print(f"Total de vendas finalizadas: {total_vendido}")
    print(f"Valor total em vendas: R$ {valor_total:.2f}")
    print(f"Ticket médio: R$ {valor_total/total_vendido:.2f}" if total_vendido > 0 else "Nenhuma venda")
    
    print("\n✅ BANCO DE DADOS POPULADO COM SUCESSO!")

except Exception as e:
    print(f"❌ Erro: {e}")
    db.rollback()

finally:
    db.close()
