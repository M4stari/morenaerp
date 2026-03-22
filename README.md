# ERP Morena Concept - Sistema de Gerenciamento de Vendas de Moda

## 📋 Descrição

Sistema Backend completo em Python para gerenciamento de uma empresa de moda, incluindo:
- ✅ Gerenciamento de Clientes
- ✅ Cadastro e Controle de Produtos
- ✅ Controle de Estoque
- ✅ Gestão de Vendas
- ✅ Geração de Relatórios

## 🚀 Requisitos

- Python 3.9+
- pip (gerenciador de pacotes Python)

## 📦 Instalação

### 1. Clone ou extraia o projeto
```bash
cd "c:\ERP MORENA CONCEPT"
```

### 2. Crie um ambiente virtual
```bash
python -m venv venv
```

### 3. Ative o ambiente virtual

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 4. Instale as dependências
```bash
pip install -r requirements.txt
```

## ⚙️ Configuração

### Banco de Dados

O projeto usa SQLite por padrão. Se desejar usar PostgreSQL:

1. Edite o arquivo `.env`:
```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/erp_moda
```

2. Instale o driver PostgreSQL:
```bash
pip install psycopg2-binary
```

## 🏃 Executando a Aplicação

```bash
python main.py
```

A API estará disponível em: **http://localhost:8000**

### Documentação Interativa

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

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
curl -X POST "http://localhost:8000/customers/" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Maria Silva\",\"cpf\":\"12345678901\",\"email\":\"maria@email.com\"}"
```

### Listar Clientes
```bash
curl "http://localhost:8000/customers/?search=Maria&skip=0&limit=10"
```

### Criar Produto
```bash
curl -X POST "http://localhost:8000/products/" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Vestido Floral\",\"sku\":\"VEST-001\",\"category\":\"Vestidos\",\"size\":\"M\",\"purchase_price\":30,\"sale_price\":89.90}"
```

### Criar Estoque
```bash
curl -X POST "http://localhost:8000/stocks/" \
  -H "Content-Type: application/json" \
  -d "{\"product_id\":1,\"quantity\":100,\"warehouse\":\"Principal\"}"
```

### Fazer Venda
```bash
curl -X POST "http://localhost:8000/sales/" \
  -H "Content-Type: application/json" \
  -d "{\"customer_id\":1,\"items\":[{\"product_id\":1,\"quantity\":2}],\"notes\":\"Venda de teste\"}"
```

## 📧 Suporte

Para dúvidas ou problemas, consulte a documentação interativa em:
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📄 Licença

Este projeto é fornecido como está para uso interno.

---

**Desenvolvido para Morena Concept** ✨
