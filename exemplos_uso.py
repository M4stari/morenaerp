"""
Exemplos de uso da API ERP Morena Concept com Python
Use este arquivo como referência para integrar com outros sistemas
"""

import requests
import json

# URL base da API
BASE_URL = "http://localhost:8000"

# ============================================================================
# EXEMPLOS DE CLIENTES
# ============================================================================

def criar_cliente():
    """Exemplo: Criar um novo cliente"""
    url = f"{BASE_URL}/customers/"
    
    dados = {
        "name": "Ana Silva",
        "cpf": "12345678901",
        "email": "ana.silva@email.com",
        "phone": "11987654321",
        "address": "Av. Paulista, 1000",
        "city": "São Paulo",
        "state": "SP",
        "zip_code": "01310-100"
    }
    
    resposta = requests.post(url, json=dados)
    print(f"Status: {resposta.status_code}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")
    
    return resposta.json()["id"] if resposta.status_code == 200 else None


def listar_clientes():
    """Exemplo: Listar clientes com busca"""
    url = f"{BASE_URL}/customers/"
    
    parametros = {
        "search": "Ana",
        "skip": 0,
        "limit": 10
    }
    
    resposta = requests.get(url, params=parametros)
    print(f"Status: {resposta.status_code}")
    print(f"Clientes encontrados: {len(resposta.json())}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")


def buscar_cliente_por_cpf(cpf):
    """Exemplo: Buscar cliente por CPF"""
    url = f"{BASE_URL}/customers/search/by-cpf/{cpf}"
    
    resposta = requests.get(url)
    print(f"Status: {resposta.status_code}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")


def atualizar_cliente(cliente_id):
    """Exemplo: Atualizar dados do cliente"""
    url = f"{BASE_URL}/customers/{cliente_id}"
    
    dados = {
        "email": "ana.silva.nova@email.com",
        "phone": "11999999999"
    }
    
    resposta = requests.put(url, json=dados)
    print(f"Status: {resposta.status_code}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")


# ============================================================================
# EXEMPLOS DE PRODUTOS
# ============================================================================

def criar_produto():
    """Exemplo: Criar um novo produto"""
    url = f"{BASE_URL}/products/"
    
    dados = {
        "name": "Blusa Estampada Verão",
        "sku": "BLUSA-EST-001-P",
        "description": "Blusa de algodão com estampa exclusiva",
        "category": "Blusas",
        "size": "P",
        "color": "Azul",
        "purchase_price": 25.50,
        "sale_price": 69.90
    }
    
    resposta = requests.post(url, json=dados)
    print(f"Status: {resposta.status_code}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")
    
    return resposta.json()["id"] if resposta.status_code == 200 else None


def listar_produtos_por_categoria(categoria):
    """Exemplo: Listar produtos de uma categoria"""
    url = f"{BASE_URL}/products/category/{categoria}"
    
    parametros = {
        "skip": 0,
        "limit": 20
    }
    
    resposta = requests.get(url, params=parametros)
    print(f"Status: {resposta.status_code}")
    print(f"Produtos em {categoria}: {len(resposta.json())}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")


def buscar_produto_por_sku(sku):
    """Exemplo: Buscar produto por SKU"""
    url = f"{BASE_URL}/products/search/by-sku/{sku}"
    
    resposta = requests.get(url)
    print(f"Status: {resposta.status_code}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")


# ============================================================================
# EXEMPLOS DE ESTOQUE
# ============================================================================

def criar_estoque(produto_id, quantidade):
    """Exemplo: Criar registro de estoque"""
    url = f"{BASE_URL}/stocks/"
    
    dados = {
        "product_id": produto_id,
        "quantity": quantidade,
        "warehouse": "Principal"
    }
    
    resposta = requests.post(url, json=dados)
    print(f"Status: {resposta.status_code}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")
    
    return resposta.json()["id"] if resposta.status_code == 200 else None


def listar_estoque_por_produto(produto_id):
    """Exemplo: Listar estoques de um produto"""
    url = f"{BASE_URL}/stocks/product/{produto_id}"
    
    resposta = requests.get(url)
    print(f"Status: {resposta.status_code}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")
    
    return resposta.json()


def adicionar_quantidade_estoque(estoque_id, quantidade):
    """Exemplo: Adicionar quantidade ao estoque"""
    url = f"{BASE_URL}/stocks/add/{estoque_id}"
    
    parametros = {
        "quantity": quantidade,
        "reason": "Reposição"
    }
    
    resposta = requests.post(url, params=parametros)
    print(f"Status: {resposta.status_code}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")


def obter_estoque_baixo(threshold=5):
    """Exemplo: Obter produtos com estoque baixo"""
    url = f"{BASE_URL}/stocks/low-stock/"
    
    parametros = {
        "threshold": threshold
    }
    
    resposta = requests.get(url, params=parametros)
    print(f"Status: {resposta.status_code}")
    print(f"Produtos com estoque baixo: {len(resposta.json())}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")


# ============================================================================
# EXEMPLOS DE VENDAS
# ============================================================================

def criar_venda(cliente_id, itens):
    """
    Exemplo: Criar uma nova venda
    
    itens: lista de dicts com product_id e quantity
    Exemplo: [{"product_id": 1, "quantity": 2}, {"product_id": 2, "quantity": 1}]
    """
    url = f"{BASE_URL}/sales/"
    
    dados = {
        "customer_id": cliente_id,
        "items": itens,
        "notes": "Venda realizada em loja"
    }
    
    resposta = requests.post(url, json=dados)
    print(f"Status: {resposta.status_code}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")
    
    return resposta.json()["id"] if resposta.status_code == 200 else None


def listar_vendas_cliente(cliente_id):
    """Exemplo: Listar todas as vendas de um cliente"""
    url = f"{BASE_URL}/sales/customer/{cliente_id}"
    
    parametros = {
        "skip": 0,
        "limit": 10
    }
    
    resposta = requests.get(url, params=parametros)
    print(f"Status: {resposta.status_code}")
    print(f"Vendas do cliente: {len(resposta.json())}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")


def obter_detalhes_venda(venda_id):
    """Exemplo: Obter detalhes completos de uma venda"""
    url = f"{BASE_URL}/sales/{venda_id}"
    
    resposta = requests.get(url)
    print(f"Status: {resposta.status_code}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")


def finalizar_venda(venda_id):
    """Exemplo: Finalizar uma venda"""
    url = f"{BASE_URL}/sales/{venda_id}/finalize"
    
    resposta = requests.post(url)
    print(f"Status: {resposta.status_code}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")


def cancelar_venda(venda_id):
    """Exemplo: Cancelar uma venda (retorna estoque)"""
    url = f"{BASE_URL}/sales/{venda_id}/cancel"
    
    resposta = requests.post(url)
    print(f"Status: {resposta.status_code}")
    print(f"Resposta: {json.dumps(resposta.json(), indent=2, ensure_ascii=False)}")


def relatorio_diario():
    """Exemplo: Gerar relatório de vendas do dia"""
    url = f"{BASE_URL}/sales/report/daily"
    
    resposta = requests.get(url)
    print(f"Status: {resposta.status_code}")
    print(f"Relatório do dia:")
    print(json.dumps(resposta.json(), indent=2, ensure_ascii=False))


def relatorio_por_cliente():
    """Exemplo: Gerar relatório de vendas por cliente"""
    url = f"{BASE_URL}/sales/report/by-customer"
    
    resposta = requests.get(url)
    print(f"Status: {resposta.status_code}")
    print(f"Vendas por cliente:")
    print(json.dumps(resposta.json(), indent=2, ensure_ascii=False))


# ============================================================================
# FLUXO COMPLETO DE TESTE
# ============================================================================

def fluxo_completo():
    """Executa um fluxo completo de teste do ERP"""
    
    print("\n" + "="*70)
    print("FLUXO COMPLETO DE TESTE DO ERP MORENA CONCEPT")
    print("="*70)
    
    # 1. Criar cliente
    print("\n1. CRIAR CLIENTE")
    print("-" * 70)
    cliente_id = criar_cliente()
    
    if not cliente_id:
        print("❌ Erro ao criar cliente")
        return
    
    print(f"✅ Cliente criado com ID: {cliente_id}\n")
    
    # 2. Criar produtos
    print("2. CRIAR PRODUTOS")
    print("-" * 70)
    produto_id_1 = criar_produto()
    
    if not produto_id_1:
        print("❌ Erro ao criar produto")
        return
    
    print(f"✅ Produto criado com ID: {produto_id_1}\n")
    
    # 3. Criar estoque
    print("3. CRIAR ESTOQUE")
    print("-" * 70)
    estoque_id = criar_estoque(produto_id_1, 100)
    
    if not estoque_id:
        print("❌ Erro ao criar estoque")
        return
    
    print(f"✅ Estoque criado com ID: {estoque_id}\n")
    
    # 4. Listar estoque baixo
    print("4. VERIFICAR ESTOQUE BAIXO")
    print("-" * 70)
    obter_estoque_baixo(threshold=150)
    
    # 5. Criar venda
    print("\n5. REALIZAR VENDA")
    print("-" * 70)
    itens = [{"product_id": produto_id_1, "quantity": 5}]
    venda_id = criar_venda(cliente_id, itens)
    
    if not venda_id:
        print("❌ Erro ao criar venda")
        return
    
    print(f"✅ Venda criada com ID: {venda_id}\n")
    
    # 6. Obter detalhes da venda
    print("6. DETALHES DA VENDA")
    print("-" * 70)
    obter_detalhes_venda(venda_id)
    
    # 7. Finalizar venda
    print("\n7. FINALIZAR VENDA")
    print("-" * 70)
    finalizar_venda(venda_id)
    
    # 8. Listar vendas do cliente
    print("\n8. VENDAS DO CLIENTE")
    print("-" * 70)
    listar_vendas_cliente(cliente_id)
    
    # 9. Relatório diário
    print("\n9. RELATÓRIO DIÁRIO")
    print("-" * 70)
    relatorio_diario()
    
    print("\n" + "="*70)
    print("✅ FLUXO COMPLETO FINALIZADO")
    print("="*70 + "\n")


if __name__ == "__main__":
    # Descomente a função que deseja testar
    
    # Testes individuais
    # criar_cliente()
    # listar_clientes()
    # criar_produto()
    # listar_produtos_por_categoria("Blusas")
    # relatorio_diario()
    
    # Ou execute o fluxo completo
    fluxo_completo()
