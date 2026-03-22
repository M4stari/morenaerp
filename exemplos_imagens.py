"""
Exemplos de uso dos novos endpoints:
- Adicionar/Editar produtos com imagem
- Editar produto via manutenção de estoque
- Visualizar detalhes do produto com análise de lucro

Execute: python exemplos_imagens.py
"""

import requests
import json

BASE_URL = "http://localhost:8000"

# ============================================================================
# EXEMPLOS DE CRIAR PRODUTO COM IMAGEM
# ============================================================================

def criar_produto_com_imagem():
    """Cria um novo produto com imagem"""
    url = f"{BASE_URL}/products/"
    
    # Exemplo 1: Com URL de placeholder
    dados = {
        "name": "Blusa Premium Verão",
        "sku": "BLUSA-PREM-VERAO-001",
        "description": "Blusa de seda premium para o verão",
        "category": "Blusas",
        "size": "M",
        "color": "Azul Royal",
        "purchase_price": 45.00,
        "sale_price": 129.90,
        "image_url": "https://via.placeholder.com/300x300?text=Blusa+Premium+Verao"
    }
    
    resposta = requests.post(url, json=dados)
    print(f"Status: {resposta.status_code}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}\n")
    
    return resposta.json()["id"] if resposta.status_code == 200 else None


def criar_produto_com_imagem_remota():
    """Cria produto com URL de imagem remota"""
    url = f"{BASE_URL}/products/"
    
    dados = {
        "name": "Vestido Festa Elegante",
        "sku": "VESTIDO-FESTA-ELEGANTE",
        "description": "Vestido elegante para festas e eventos especiais",
        "category": "Vestidos",
        "size": "P",
        "color": "Vermelho",
        "purchase_price": 80.00,
        "sale_price": 249.90,
        "image_url": "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg"
    }
    
    resposta = requests.post(url, json=dados)
    print(f"Vestido criado com sucesso: {resposta.status_code}")
    return resposta.json()["id"] if resposta.status_code == 200 else None


# ============================================================================
# EXEMPLOS: EDITAR PRODUTO VIA MANUTENÇÃO DE ESTOQUE (NOVO)
# ============================================================================

def editar_produto_via_estoque(produto_id):
    """Edita todos os dados do produto via estoque"""
    url = f"{BASE_URL}/stocks/product/{produto_id}/edit"
    
    # Atualizar apenas a imagem
    dados = {
        "image_url": "https://via.placeholder.com/300x300?text=Blusa+Atualizada"
    }
    
    resposta = requests.put(url, json=dados)
    print(f"Status: {resposta.status_code}")
    print(f"Produto atualizado:")
    print(json.dumps(resposta.json(), indent=2, ensure_ascii=False))
    print()


def atualizar_preco_e_imagem(produto_id):
    """Atualiza preço e imagem do produto"""
    url = f"{BASE_URL}/stocks/product/{produto_id}/edit"
    
    dados = {
        "purchase_price": 50.00,
        "sale_price": 149.90,
        "image_url": "https://via.placeholder.com/300x300?text=Novo+Preco"
    }
    
    resposta = requests.put(url, json=dados)
    
    if resposta.status_code == 200:
        resultado = resposta.json()
        print("✅ Atualização bem-sucedida!")
        print(f"Produto: {resultado['product_name']}")
        print(f"Preço de compra: R$ {resultado['purchase_price']}")
        print(f"Preço de venda: R$ {resultado['sale_price']}")
        print(f"Imagem: {resultado['image_url']}\n")
    else:
        print(f"❌ Erro: {resposta.status_code}")
        print(resposta.json())


def editar_categoria_tamanho_cor(produto_id):
    """Edita categoria, tamanho e cor do produto"""
    url = f"{BASE_URL}/stocks/product/{produto_id}/edit"
    
    dados = {
        "category": "Blusas Premium",
        "size": "G",
        "color": "Azul Celeste",
        "description": "Blusa premium para descontos especiais"
    }
    
    resposta = requests.put(url, json=dados)
    
    if resposta.status_code == 200:
        print("✅ Classificação do produto atualizada!")
        print(json.dumps(resposta.json(), indent=2, ensure_ascii=False))
    else:
        print(f"❌ Erro ao atualizar: {resposta.status_code}")


# ============================================================================
# EXEMPLO: VER DETALHES COMPLETOS DO PRODUTO (NOVO)
# ============================================================================

def ver_detalhes_completos(produto_id):
    """Obtém informações completas do produto com análise de lucro"""
    url = f"{BASE_URL}/stocks/product/{produto_id}/details"
    
    resposta = requests.get(url)
    
    if resposta.status_code == 200:
        detalhes = resposta.json()
        
        print("=" * 70)
        print("DETALHES COMPLETOS DO PRODUTO")
        print("=" * 70)
        print(f"\n📦 PRODUTO")
        print(f"   ID: {detalhes['id']}")
        print(f"   Nome: {detalhes['name']}")
        print(f"   SKU: {detalhes['sku']}")
        print(f"   Categoria: {detalhes['category']}")
        print(f"   Tamanho: {detalhes['size']}")
        print(f"   Cor: {detalhes['color']}")
        
        print(f"\n💰 PREÇOS")
        print(f"   Preço de Compra: R$ {detalhes['purchase_price']:.2f}")
        print(f"   Preço de Venda: R$ {detalhes['sale_price']:.2f}")
        print(f"   Lucro por Item: R$ {detalhes['profit_per_item']:.2f}")
        print(f"   Margem de Lucro: {detalhes['profit_margin_percent']:.2f}%")
        
        print(f"\n📊 ESTOQUE")
        print(f"   Quantidade Total: {detalhes['total_quantity']} unidades")
        
        if detalhes['total_quantity'] > 0:
            valor_estoque = detalhes['total_quantity'] * detalhes['sale_price']
            lucro_total = detalhes['total_quantity'] * detalhes['profit_per_item']
            print(f"   Valor em Estoque: R$ {valor_estoque:.2f}")
            print(f"   Lucro Total Potencial: R$ {lucro_total:.2f}")
        
        print(f"\n🖼️  IMAGEM")
        print(f"   {detalhes['image_url'] if detalhes['image_url'] else 'Sem imagem'}")
        
        print(f"\n📅 DATAS")
        print(f"   Criado em: {detalhes['created_at']}")
        print(f"   Atualizado em: {detalhes['updated_at']}")
        
        print("\n" + "=" * 70 + "\n")
        
    else:
        print(f"❌ Erro ao obter detalhes: {resposta.status_code}")


# ============================================================================
# FLUXO COMPLETO: CRIAR E EDITAR PRODUTO
# ============================================================================

def fluxo_completo():
    """Executa um fluxo completo de criar e editar produto"""
    
    print("\n" + "=" * 70)
    print("FLUXO COMPLETO: CRIAR E EDITAR PRODUTO COM IMAGEM")
    print("=" * 70 + "\n")
    
    # 1. Criar produto com imagem
    print("1️⃣  CRIANDO PRODUTO COM IMAGEM")
    print("-" * 70)
    produto_id = criar_produto_com_imagem()
    
    if not produto_id:
        print("❌ Erro ao criar produto")
        return
    
    print(f"✅ Produto criado com ID: {produto_id}\n")
    
    # 2. Ver detalhes do produto
    print("2️⃣  VISUALIZANDO DETALHES")
    print("-" * 70)
    ver_detalhes_completos(produto_id)
    
    # 3. Atualizar preço e imagem
    print("3️⃣  ATUALIZANDO PREÇO E IMAGEM (Via estoque)")
    print("-" * 70)
    atualizar_preco_e_imagem(produto_id)
    
    # 4. Ver detalhes atualizados
    print("4️⃣  VISUALIZANDO DETALHES ATUALIZADOS")
    print("-" * 70)
    ver_detalhes_completos(produto_id)
    
    # 5. Atualizar classificação
    print("5️⃣  ATUALIZANDO CATEGORIA/TAMANHO/COR")
    print("-" * 70)
    editar_categoria_tamanho_cor(produto_id)
    
    # 6. Detalhes finais
    print("\n6️⃣  DETALHES FINAIS")
    print("-" * 70)
    ver_detalhes_completos(produto_id)
    
    print("=" * 70)
    print("✅ FLUXO COMPLETO FINALIZADO")
    print("=" * 70 + "\n")


# ============================================================================
# EXEMPLO: ANÁLISE DE LUCRO
# ============================================================================

def analisar_lucro_produtos():
    """Analisa lucro de vários produtos"""
    print("\n" + "=" * 70)
    print("ANÁLISE DE LUCRO DOS PRODUTOS")
    print("=" * 70 + "\n")
    
    # Listar produtos
    response = requests.get(f"{BASE_URL}/products/", params={"limit": 5})
    
    if response.status_code == 200:
        produtos = response.json()
        
        print(f"{'SKU':<20} {'Produto':<30} {'Margem':<10}")
        print("-" * 70)
        
        for produto in produtos:
            margem = ((produto['sale_price'] - produto['purchase_price']) / 
                     produto['purchase_price'] * 100)
            
            print(f"{produto['sku']:<20} {produto['name']:<30} {margem:>6.1f}%")
        
        print("\n")


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    # Descomente para testar:
    
    # Teste individual
    # produto_id = criar_produto_com_imagem()
    # ver_detalhes_completos(produto_id)
    
    # Teste com imagem remota
    # produto_id = criar_produto_com_imagem_remota()
    
    # Fluxo completo
    fluxo_completo()
    
    # Análise de lucro
    # analisar_lucro_produtos()
