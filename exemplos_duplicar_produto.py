"""
Exemplos de uso da nova função: DUPLICAR PRODUTO
Execute: python exemplos_duplicar_produto.py
"""

import requests
import json

BASE_URL = "http://localhost:8000"

# ============================================================================
# DUPLICAR PRODUTO - EXEMPLOS
# ============================================================================

def duplicar_produto_simples(product_id):
    """Duplica um produto com um novo SKU"""
    url = f"{BASE_URL}/products/{product_id}/duplicate"
    
    parametros = {
        "new_sku": "BLUSA-BAS-001-COPIA"
    }
    
    resposta = requests.post(url, params=parametros)
    
    if resposta.status_code == 200:
        novo_produto = resposta.json()
        print("✅ Produto duplicado com sucesso!")
        print(f"   ID original: {product_id}")
        print(f"   ID novo: {novo_produto['id']}")
        print(f"   SKU novo: {novo_produto['sku']}")
        print(f"   Nome: {novo_produto['name']}\n")
        return novo_produto['id']
    else:
        print(f"❌ Erro: {resposta.status_code}")
        print(resposta.json())
        return None


def duplicar_produto_cor_diferente(product_id, cor="Azul"):
    """Duplica um produto mas com cor diferente"""
    url = f"{BASE_URL}/products/{product_id}/duplicate"
    
    parametros = {
        "new_sku": f"BLUSA-BAS-001-{cor.upper()}",
        "new_color": cor
    }
    
    resposta = requests.post(url, params=parametros)
    
    if resposta.status_code == 200:
        novo_produto = resposta.json()
        print(f"✅ Cópia com cor {cor} criada!")
        print(f"   ID: {novo_produto['id']}")
        print(f"   SKU: {novo_produto['sku']}")
        print(f"   Cor: {novo_produto['color']}\n")
        return novo_produto['id']
    else:
        print(f"❌ Erro ao duplicar: {resposta.status_code}")
        return None


def duplicar_produto_tamanho_diferente(product_id, tamanho="G"):
    """Duplica um produto mas com tamanho diferente"""
    url = f"{BASE_URL}/products/{product_id}/duplicate"
    
    parametros = {
        "new_sku": f"BLUSA-BAS-001-{tamanho}",
        "new_size": tamanho
    }
    
    resposta = requests.post(url, params=parametros)
    
    if resposta.status_code == 200:
        novo_produto = resposta.json()
        print(f"✅ Cópia tamanho {tamanho} criada!")
        print(f"   ID: {novo_produto['id']}")
        print(f"   SKU: {novo_produto['sku']}")
        print(f"   Tamanho: {novo_produto['size']}\n")
        return novo_produto['id']
    else:
        print(f"❌ Erro ao duplicar: {resposta.status_code}")
        return None


def duplicar_produto_completo(product_id, novo_sku, novo_nome, cor, tamanho):
    """Duplica um produto mudando várias informações"""
    url = f"{BASE_URL}/products/{product_id}/duplicate"
    
    parametros = {
        "new_sku": novo_sku,
        "new_name": novo_nome,
        "new_color": cor,
        "new_size": tamanho
    }
    
    resposta = requests.post(url, params=parametros)
    
    if resposta.status_code == 200:
        novo_produto = resposta.json()
        print("✅ Produto duplicado com todas as variações!")
        print(f"   Nome: {novo_produto['name']}")
        print(f"   SKU: {novo_produto['sku']}")
        print(f"   Cor: {novo_produto['color']}")
        print(f"   Tamanho: {novo_produto['size']}")
        print(f"   Preço de venda: R$ {novo_produto['sale_price']}\n")
        return novo_produto['id']
    else:
        print(f"❌ Erro: {resposta.status_code}")
        print(resposta.json())
        return None


# ============================================================================
# FLUXO PRÁTICO: CRIAR VARIAÇÕES DE UM PRODUTO
# ============================================================================

def criar_variações_cores(product_id):
    """Cria variações de cores do mesmo produto"""
    print("\n" + "="*70)
    print("CRIANDO VARIAÇÕES DE CORES")
    print("="*70 + "\n")
    
    cores = ["Branco", "Preto", "Vermelho", "Azul", "Verde"]
    
    for cor in cores:
        sku = f"BLUSA-VAR-{cor.upper()}"
        nome = f"Blusa Básica {cor}"
        
        url = f"{BASE_URL}/products/{product_id}/duplicate"
        params = {
            "new_sku": sku,
            "new_name": nome,
            "new_color": cor
        }
        
        resposta = requests.post(url, params=params)
        
        if resposta.status_code == 200:
            print(f"✅ {cor} - SKU: {sku}")
        else:
            print(f"❌ Erro ao criar {cor}")


def criar_variações_tamanhos(product_id):
    """Cria variações de tamanhos do mesmo produto"""
    print("\n" + "="*70)
    print("CRIANDO VARIAÇÕES DE TAMANHOS")
    print("="*70 + "\n")
    
    tamanhos = ["P", "M", "G", "GG"]
    
    for tamanho in tamanhos:
        sku = f"BLUSA-BASIC-TAMANHO-{tamanho}"
        
        url = f"{BASE_URL}/products/{product_id}/duplicate"
        params = {
            "new_sku": sku,
            "new_size": tamanho
        }
        
        resposta = requests.post(url, params=params)
        
        if resposta.status_code == 200:
            print(f"✅ Tamanho {tamanho} - SKU: {sku}")
        else:
            print(f"❌ Erro ao criar tamanho {tamanho}")


def criar_matriz_completa(product_id):
    """Cria uma matriz de cores x tamanhos"""
    print("\n" + "="*70)
    print("CRIANDO MATRIZ CORES × TAMANHOS")
    print("="*70 + "\n")
    
    cores = ["Preto", "Branco", "Azul"]
    tamanhos = ["P", "M", "G"]
    
    contador = 0
    
    for cor in cores:
        for tamanho in tamanhos:
            sku = f"BLUSA-{cor.upper()}-{tamanho}"
            nome = f"Blusa {cor} Tamanho {tamanho}"
            
            url = f"{BASE_URL}/products/{product_id}/duplicate"
            params = {
                "new_sku": sku,
                "new_name": nome,
                "new_color": cor,
                "new_size": tamanho
            }
            
            resposta = requests.post(url, params=params)
            
            if resposta.status_code == 200:
                print(f"✅ {cor} - {tamanho} (SKU: {sku})")
                contador += 1
            else:
                print(f"❌ Erro: {cor} - {tamanho}")
    
    print(f"\n✅ Total criado: {contador} variações")


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    
    print("\n" + "="*70)
    print("EXEMPLOS: DUPLICAR PRODUTOS")
    print("="*70 + "\n")
    
    # Obter primeiro produto para trabalhar
    resposta = requests.get(f"{BASE_URL}/products/", params={"limit": 1})
    
    if resposta.status_code == 200 and len(resposta.json()) > 0:
        produto_original = resposta.json()[0]
        product_id = produto_original['id']
        
        print(f"📦 Produto original encontrado:")
        print(f"   ID: {product_id}")
        print(f"   Nome: {produto_original['name']}")
        print(f"   SKU: {produto_original['sku']}")
        print(f"   Cor: {produto_original['color']}")
        print(f"   Tamanho: {produto_original['size']}\n")
        
        # Descomente para testar:
        
        # 1. Duplicação simples
        # print("1️⃣  DUPLICAÇÃO SIMPLES")
        # print("-"*70)
        # duplicar_produto_simples(product_id)
        
        # 2. Duplicar com cor diferente
        # print("2️⃣  DUPLICAR COM COR DIFERENTE")
        # print("-"*70)
        # duplicar_produto_cor_diferente(product_id, "Vermelho")
        
        # 3. Duplicar com tamanho diferente
        # print("3️⃣  DUPLICAR COM TAMANHO DIFERENTE")
        # print("-"*70)
        # duplicar_produto_tamanho_diferente(product_id, "GG")
        
        # 4. Duplicar com múltiplas variações
        # print("4️⃣  DUPLICAR COMPLETO")
        # print("-"*70)
        # duplicar_produto_completo(
        #     product_id,
        #     novo_sku="BLUSA-PREMIUM-AZUL-G",
        #     novo_nome="Blusa Premium Azul",
        #     cor="Azul Royal",
        #     tamanho="G"
        # )
        
        # 5. Criar variações de cores
        # print("\n5️⃣  VARIAÇÕES DE CORES")
        # criar_variações_cores(product_id)
        
        # 6. Criar variações de tamanhos
        # print("6️⃣  VARIAÇÕES DE TAMANHOS")
        # criar_variações_tamanhos(product_id)
        
        # 7. Criar matriz completa
        # print("7️⃣  MATRIZ CORES × TAMANHOS")
        criar_matriz_completa(product_id)
        
    else:
        print("❌ Nenhum produto encontrado para duplicar")
        print("Crie um produto primeiro: POST /products/")
