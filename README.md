# ERP Morena Concept - Sistema de Gerenciamento de Vendas de Moda

## 📋 Descrição

Sistema Backend completo em Python utilizando **FastAPI** e **SQLAlchemy**, com uma **Arquitetura Modular baseada em Contextos (Package-by-Feature)** para maior legibilidade, escalabilidade e facilidade de manutenção. 

O sistema gerencia os seguintes contextos:
- 👥 **Auth**: Autenticação de usuários baseada em JWT tokens.
- 👥 **Customers**: Gerenciamento completo de clientes.
- 📦 **Products**: Cadastro, controle e duplicação de produtos.
- 📊 **Stocks**: Manutenção de estoque por armazém.
- 🛒 **Sales**: Vendas com parcelamento dinâmico e relatórios financeiros/dashboard.

## 📁 Arquitetura Modular do Projeto

O código-fonte está estruturado sob a pasta `app/`, separando cada domínio por contexto:
```
app/
  core/           # Configurações globais e inicialização do Banco de Dados
  modules/
    auth/         # Contexto de Autenticação (JWT, Login, Me)
    customers/    # Contexto de Clientes (Models, Schemas, Router)
    products/     # Contexto de Produtos (Models, Schemas, Router)
    stocks/       # Contexto de Estoque (Models, Schemas, Router)
    sales/        # Contexto de Vendas e Relatórios (Models, Schemas, Router)
```

## 🚀 Requisitos

- Python 3.9+
- pip (gerenciador de pacotes Python)

## 📦 Instalação e Execução Local

### 1. Clone ou acesse a pasta do projeto
```bash
cd "c:\Users\Pichau\Desktop\projects\morenaerp"
```

### 2. Crie e ative um ambiente virtual (Opcional, mas recomendado)
```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Ativar ambiente virtual (Windows CMD)
venv\Scripts\activate.bat

# Ativar ambiente virtual (Linux/Mac)
source venv/bin/activate
```

### 3. Instale as dependências (FastAPI, SQLAlchemy, Uvicorn, etc.)
```bash
pip install -r requirements.txt
```

### 4. Configuração Automática do Banco de Dados (SQLite)
O projeto vem configurado para rodar com **SQLite** localmente por padrão, **sem necessidade de instalar nenhum servidor de banco de dados**.
Copie o arquivo `.env.example` para `.env` ou use o padrão gerado automaticamente:
```bash
# No Windows PowerShell:
Copy-Item .env.example .env
```
O banco de dados SQLite (`erp_moda.db`) será criado e configurado automaticamente na primeira execução.

---

## 🏃 Executando a Aplicação

Para iniciar o servidor FastAPI local na porta **8888** (definida no arquivo `.env`):
```bash
python main.py
```
A API estará disponível em: **http://localhost:8888**

### 🎨 Documentação Interativa (Swagger UI)
O FastAPI gera automaticamente a documentação interativa baseada na especificação OpenAPI (Swagger). Todos os endpoints e schemas do projeto estão mapeados nela:

- **Swagger UI**: [http://localhost:8888/docs](http://localhost:8888/docs) (Permite testar requisições diretamente do navegador)
- **ReDoc**: [http://localhost:8888/redoc](http://localhost:8888/redoc)


## 📚 Endpoints Principais

### 👥 Clientes (`/customers`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/customers/` | Criar novo cliente |
| GET | `/customers/` | Listar clientes |
| GET | `/customers/{id}` | Obter cliente por ID |
| GET | `/customers/search/by-cpf/{cpf}` | Buscar cliente por CPF |
| PUT | `/customers/{id}` | Atualizar cliente |
| DELETE | `/customers/{id}` | Deletar cliente |

**Exemplo de Criação de Cliente:**
```json
{
  "name": "João Silva",
  "cpf": "12345678910",
  "email": "joao@email.com",
  "phone": "11999999999",
  "address": "Rua A, 123",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01234-567"
}
```

### 📦 Produtos (`/products`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/products/` | Criar novo produto |
| GET | `/products/` | Listar produtos |
| GET | `/products/{id}` | Obter produto por ID |
| GET | `/products/search/by-sku/{sku}` | Buscar por SKU |
| GET | `/products/category/{categoria}` | Listar por categoria |
| PUT | `/products/{id}` | Atualizar produto |
| DELETE | `/products/{id}` | Deletar produto |

**Exemplo de Novo Produto:**
```json
{
  "name": "Blusa Feminina Verão",
  "sku": "BLUSA-001-P",
  "description": "Blusa de algodão para verão",
  "category": "Blusas",
  "size": "P",
  "color": "Rosa",
  "purchase_price": 25.00,
  "sale_price": 59.90
}
```

### 📊 Estoque (`/stocks`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/stocks/` | Adicionar estoque |
| GET | `/stocks/` | Listar estoques |
| GET | `/stocks/{id}` | Obter estoque por ID |
| GET | `/stocks/product/{product_id}` | Estoques por produto |
| GET | `/stocks/low-stock/` | Produtos com estoque baixo |
| POST | `/stocks/add/{stock_id}` | Adicionar quantidade |
| POST | `/stocks/remove/{stock_id}` | Remover quantidade |
| PUT | `/stocks/{id}` | Atualizar estoque |
| **PUT** | **`/stocks/product/{product_id}/edit`** | **Editar TODOS os dados do produto (NOVO)** |
| **GET** | **`/stocks/product/{product_id}/details`** | **Detalhes completos + análise de lucro (NOVO)** |

**Exemplo de Criação de Estoque:**
```json
{
  "product_id": 1,
  "quantity": 50,
  "warehouse": "Principal"
}
```

**Exemplo: Editar Produto via Estoque (NOVO):**
```json
PUT /stocks/product/1/edit

{
  "name": "Blusa Premium",
  "image_url": "https://exemplo.com/imagem.jpg",
  "purchase_price": 45.00,
  "sale_price": 129.90,
  "category": "Blusas",
  "size": "M",
  "color": "Azul Royal"
}
```

**Exemplo: Detalhes do Produto (NOVO):**
```json
GET /stocks/product/1/details

Retorna:
{
  "id": 1,
  "name": "Blusa Premium",
  "sku": "BLUSA-001",
  "purchase_price": 45.00,
  "sale_price": 129.90,
  "image_url": "https://exemplo.com/imagem.jpg",
  "total_quantity": 150,
  "profit_per_item": 84.90,
  "profit_margin_percent": 188.67,
  "category": "Blusas",
  "size": "M",
  "color": "Azul Royal"
}
```

### 🛒 Vendas (`/sales`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/sales/` | Criar nova venda |
| GET | `/sales/` | Listar vendas |
| GET | `/sales/{id}` | Obter venda por ID |
| GET | `/sales/customer/{customer_id}` | Vendas de um cliente |
| POST | `/sales/{id}/finalize` | Finalizar venda |
| POST | `/sales/{id}/cancel` | Cancelar venda |
| DELETE | `/sales/{id}` | Deletar venda |
| GET | `/sales/report/daily` | Relatório diário |
| GET | `/sales/report/by-customer` | Vendas por cliente |

**Exemplo de Nova Venda:**
```json
{
  "customer_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 1
    }
  ],
  "notes": "Cliente volta com cupom"
}
```

## 🔄 Fluxo de Operação

### 1. Adicionar Cliente
```bash
POST /customers/
```

### 2. Cadastrar Produtos
```bash
POST /products/
```

### 3. Criar Estoque
```bash
POST /stocks/
```

### 4. Reposição de Estoque
```bash
POST /stocks/add/{stock_id}?quantity=10&reason=Reposição
```

### 5. Realizar Venda
```bash
POST /sales/
```

A venda automaticamente:
- Valida se o cliente existe
- Verifica disponibilidade de estoque
- Reduz quantidade do estoque
- Calcula total da venda
- Registra todos os itens

### 6. Cancelar Venda
```bash
POST /sales/{sale_id}/cancel
```

Automaticamente retorna produtos ao estoque.

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

1. **customers** - Dados de clientes
2. **products** - Catálogo de produtos
3. **stocks** - Inventário por warehouse
4. **sales** - Cabeçalho de vendas
5. **sale_items** - Itens vinculados às vendas

### Relacionamentos

- Customer 1 → N Sales
- Product 1 → N Stocks
- Product 1 → N SaleItems
- Sale 1 → N SaleItems

## 🐛 Tratamento de Erros

Todos os endpoints retornam códigos HTTP apropriados:

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro na requisição
- `404` - Recurso não encontrado
- `500` - Erro do servidor

## 🔐 Segurança

Para produção, recomenda-se:

1. Adicionar autenticação (JWT)
2. Usar variáveis de ambiente para credenciais
3. Implementar rate limiting
4. Adicionar validação mais rigorosa
5. Usar HTTPS

## 📝 Exemplos de Uso com cURL

### Criar Cliente
```bash
curl -X POST "http://localhost:8888/customers/" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Maria Silva\",\"cpf\":\"12345678901\",\"email\":\"maria@email.com\"}"
```

### Listar Clientes
```bash
curl "http://localhost:8888/customers/?search=Maria&skip=0&limit=10"
```

### Criar Produto
```bash
curl -X POST "http://localhost:8888/products/" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Vestido Floral\",\"sku\":\"VEST-001\",\"category\":\"Vestidos\",\"size\":\"M\",\"purchase_price\":30,\"sale_price\":89.90}"
```

### Criar Estoque
```bash
curl -X POST "http://localhost:8888/stocks/" \
  -H "Content-Type: application/json" \
  -d "{\"product_id\":1,\"quantity\":100,\"warehouse\":\"Principal\"}"
```

### Fazer Venda
```bash
curl -X POST "http://localhost:8888/sales/" \
  -H "Content-Type: application/json" \
  -d "{\"customer_id\":1,\"items\":[{\"product_id\":1,\"quantity\":2}],\"notes\":\"Venda de teste\"}"
```

## 📧 Suporte

Para dúvidas ou problemas, consulte a documentação interativa em:
- Swagger: http://localhost:8888/docs
- ReDoc: http://localhost:8888/redoc

## 📄 Licença

Este projeto é fornecido como está para uso interno.

---

**Desenvolvido para Morena Concept** ✨
