"""
Script de testes automatizados para ERP Morena Concept.
Execute: python test_api.py
"""

import os

import requests
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "http://localhost:8000"
SESSION = requests.Session()


class Colors:
    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    END = "\033[0m"


def print_success(msg):
    print(f"{Colors.GREEN}OK {msg}{Colors.END}")


def print_error(msg):
    print(f"{Colors.RED}ERRO {msg}{Colors.END}")


def print_info(msg):
    print(f"{Colors.BLUE}> {msg}{Colors.END}")


def print_section(title):
    print(f"\n{Colors.YELLOW}{'=' * 70}{Colors.END}")
    print(f"{Colors.YELLOW}{title}{Colors.END}")
    print(f"{Colors.YELLOW}{'=' * 70}{Colors.END}\n")


def authenticate():
    print_section("AUTENTICACAO")
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "email": os.getenv("ADMIN_EMAIL"),
            "password": os.getenv("ADMIN_PASSWORD"),
        },
    )

    if response.status_code != 200:
        print_error(f"Falha ao autenticar: {response.status_code}")
        print(response.text)
        return False

    token = response.json()["access_token"]
    SESSION.headers.update({"Authorization": f"Bearer {token}"})
    print_success("Token JWT recebido")
    return True


def test_customers():
    print_section("TESTANDO CLIENTES")
    customer_data = {
        "name": "Test Customer",
        "cpf": "99999999999",
        "email": "test@test.com",
        "phone": "1199999999",
    }

    response = SESSION.post(f"{BASE_URL}/customers/", json=customer_data)
    if response.status_code not in (200, 400):
        print_error(f"Erro ao criar cliente: {response.status_code}")
        print(response.text)
        return None

    if response.status_code == 400:
        print_info("Cliente de teste ja existe, buscando lista...")
        response = SESSION.get(f"{BASE_URL}/customers/", params={"limit": 100})
        customers = response.json()
        customer = next((item for item in customers if item["cpf"] == "99999999999"), None)
        if not customer:
            print_error("Cliente de teste nao encontrado")
            return None
        print_success(f"Cliente reutilizado: ID {customer['id']}")
        return customer["id"]

    customer = response.json()
    print_success(f"Cliente criado: ID {customer['id']}")
    return customer["id"]


def test_products():
    print_section("TESTANDO PRODUTOS")
    product_data = {
        "name": "Test Blusa",
        "sku": "TEST-001",
        "category": "Blusas",
        "size": "M",
        "color": "Azul",
        "purchase_price": 25.00,
        "sale_price": 59.90,
    }

    response = SESSION.post(f"{BASE_URL}/products/", json=product_data)
    if response.status_code not in (200, 400):
        print_error(f"Erro ao criar produto: {response.status_code}")
        print(response.text)
        return None

    if response.status_code == 400:
        print_info("Produto de teste ja existe, buscando lista...")
        response = SESSION.get(f"{BASE_URL}/products/", params={"limit": 100})
        products = response.json()
        product = next((item for item in products if item["sku"] == "TEST-001"), None)
        if not product:
            print_error("Produto de teste nao encontrado")
            return None
        print_success(f"Produto reutilizado: ID {product['id']}")
        return product["id"]

    product = response.json()
    print_success(f"Produto criado: ID {product['id']}")
    return product["id"]


def test_stocks(product_id):
    print_section("TESTANDO ESTOQUE")
    stock_data = {
        "product_id": product_id,
        "quantity": 100,
        "warehouse": "Principal",
    }

    response = SESSION.post(f"{BASE_URL}/stocks/", json=stock_data)
    if response.status_code not in (200, 400):
        print_error(f"Erro ao criar estoque: {response.status_code}")
        print(response.text)
        return None

    if response.status_code == 400:
        print_info("Estoque ja existe, buscando lista...")
        response = SESSION.get(f"{BASE_URL}/stocks/", params={"product_id": product_id})
        stocks = response.json()
        stock = next((item for item in stocks if item["warehouse"] == "Principal"), None)
        if not stock:
            print_error("Estoque de teste nao encontrado")
            return None
    else:
        stock = response.json()

    print_success(f"Estoque disponivel: ID {stock['id']}")

    response = SESSION.post(
        f"{BASE_URL}/stocks/add/{stock['id']}",
        params={"quantity": 5, "reason": "Reposicao de teste"},
    )
    if response.status_code == 200:
        print_success("Reposicao executada")
    else:
        print_error(f"Erro na reposicao: {response.status_code}")

    return stock["id"]


def test_sales(customer_id, product_id):
    print_section("TESTANDO VENDAS")
    sale_data = {
        "customer_id": customer_id,
        "items": [{"product_id": product_id, "quantity": 1}],
        "notes": "Venda de teste automatico",
    }

    response = SESSION.post(f"{BASE_URL}/sales/", json=sale_data)
    if response.status_code != 200:
        print_error(f"Erro ao criar venda: {response.status_code}")
        print(response.text)
        return None

    sale = response.json()
    print_success(f"Venda criada: ID {sale['id']}")

    finalize_response = SESSION.post(f"{BASE_URL}/sales/{sale['id']}/finalize")
    if finalize_response.status_code == 200:
        print_success("Venda finalizada")
    else:
        print_error(f"Erro ao finalizar venda: {finalize_response.status_code}")

    return sale["id"]


def test_reports():
    print_section("TESTANDO RELATORIOS")

    daily = SESSION.get(f"{BASE_URL}/sales/report/daily")
    if daily.status_code == 200:
        report = daily.json()
        print_success(f"Relatorio diario OK: {report['total_sales']} vendas")
    else:
        print_error(f"Erro no relatorio diario: {daily.status_code}")

    by_customer = SESSION.get(f"{BASE_URL}/sales/report/by-customer")
    if by_customer.status_code == 200:
        print_success("Relatorio por cliente OK")
    else:
        print_error(f"Erro no relatorio por cliente: {by_customer.status_code}")


def test_health():
    print_section("VERIFICANDO SAUDE DA API")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print_success("API esta saudavel")
            return True
        print_error(f"API retornou status {response.status_code}")
        return False
    except requests.exceptions.ConnectionError:
        print_error(f"Nao foi possivel conectar a {BASE_URL}")
        print_info("Certifique-se de que a API esta rodando: python main.py")
        return False


def main():
    print_section("ERP MORENA CONCEPT - TESTES AUTOMATIZADOS")

    if not test_health():
        return

    if not authenticate():
        return

    customer_id = test_customers()
    product_id = test_products()
    stock_id = test_stocks(product_id) if product_id else None
    sale_id = test_sales(customer_id, product_id) if customer_id and product_id else None
    test_reports()

    print_section("RESUMO")
    print_success(f"Cliente ID: {customer_id}")
    print_success(f"Produto ID: {product_id}")
    print_success(f"Estoque ID: {stock_id}")
    print_success(f"Venda ID: {sale_id}")


if __name__ == "__main__":
    main()
