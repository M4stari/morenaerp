# DIAGRAMA DE BANCO DE DADOS - ERP MORENA CONCEPT

## Estrutura de Tabelas e Relacionamentos

```
┌─────────────────┐
│   CUSTOMERS     │
├─────────────────┤
│ id (PK)         │
│ name            │
│ cpf (UNIQUE)    │
│ email           │
│ phone           │
│ address         │
│ city            │
│ state           │
│ zip_code        │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐
│    SALES        │
├─────────────────┤
│ id (PK)         │
│ customer_id(FK) │──────┐
│ sale_date       │      │
│ total_amount    │      │
│ status          │      │
│ notes           │      │
│ created_at      │      │
│ updated_at      │      │
└────────┬────────┘      │
         │                │
         │ 1:N            │ (Referência para CUSTOMERS)
         │                │
         ▼                └──────────────┐
┌─────────────────┐                     │ (Inverso)
│  SALE_ITEMS     │
├─────────────────┤
│ id (PK)         │
│ sale_id (FK) ───┼──────► SALES
│ product_id(FK)──┼──────┐
│ quantity        │      │
│ unit_price      │      │
│ subtotal        │      │
└─────────────────┘      │
                         │
              (Referência para PRODUCTS)
                         │
         ┌───────────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────────┐
│     PRODUCTS        │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ sku (UNIQUE)        │
│ description         │
│ category            │
│ size                │
│ color               │
│ purchase_price      │
│ sale_price          │
│ created_at          │
│ updated_at          │
└────────┬────────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────────┐
│     STOCKS          │
├─────────────────────┤
│ id (PK)             │
│ product_id (FK) ────┼──► PRODUCTS
│ quantity            │
│ warehouse           │
│ last_updated        │
└─────────────────────┘
```

## Descrição das Tabelas

### 1. CUSTOMERS (Clientes)
Armazena informações dos clientes da loja.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | INT | PK, AUTO_INCREMENT | Identificador único |
| name | VARCHAR(100) | NOT NULL | Nome completo do cliente |
| cpf | VARCHAR(14) | UNIQUE, NOT NULL | CPF do cliente (validação) |
| email | VARCHAR(100) | UNIQUE | Email do cliente |
| phone | VARCHAR(20) | | Telefone |
| address | TEXT | | Endereço completo |
| city | VARCHAR(50) | | Cidade |
| state | VARCHAR(2) | | Estado (UF) |
| zip_code | VARCHAR(10) | | CEP |
| created_at | DATETIME | DEFAULT NOW() | Data de criação |
| updated_at | DATETIME | DEFAULT NOW() | Data da última atualização |

### 2. PRODUCTS (Produtos)
Catálogo de produto disponíveis para venda.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | INT | PK, AUTO_INCREMENT | Identificador único |
| name | VARCHAR(150) | NOT NULL | Nome do produto |
| sku | VARCHAR(50) | UNIQUE, NOT NULL | Código SKU (Stock Keeping Unit) |
| description | TEXT | | Descrição detalhada |
| category | VARCHAR(50) | NOT NULL | Categoria (Blusas, Calças, Vestidos, etc) |
| size | VARCHAR(10) | NOT NULL | Tamanho (P, M, G, GG, etc) |
| color | VARCHAR(30) | | Cor do produto |
| purchase_price | FLOAT | NOT NULL | Preço de custo |
| sale_price | FLOAT | NOT NULL | Preço de venda |
| created_at | DATETIME | DEFAULT NOW() | Data de criação |
| updated_at | DATETIME | DEFAULT NOW() | Data da última atualização |

### 3. STOCKS (Estoque)
Controla a quantidade de produtos em estoque.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | INT | PK, AUTO_INCREMENT | Identificador único |
| product_id | INT | FK → PRODUCTS | Referência ao produto |
| quantity | INT | DEFAULT 0 | Quantidade em estoque |
| warehouse | VARCHAR(50) | DEFAULT 'Principal' | Local do armazenamento |
| last_updated | DATETIME | DEFAULT NOW() | Data da última atualização |

**Índices:**
- product_id (para buscar estoque por produto)
- warehouse (para filtrar por armazém)

### 4. SALES (Vendas)
Registra cada transação de venda realizada.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | INT | PK, AUTO_INCREMENT | Identificador único |
| customer_id | INT | FK → CUSTOMERS | Cliente que comprou |
| sale_date | DATETIME | DEFAULT NOW() | Data da venda |
| total_amount | FLOAT | NOT NULL | Valor total da venda |
| status | VARCHAR(20) | DEFAULT 'Pendente' | Status (Pendente, Finalizada, Cancelada) |
| notes | TEXT | | Notas adicionais |
| created_at | DATETIME | DEFAULT NOW() | Data de criação |
| updated_at | DATETIME | DEFAULT NOW() | Data da última atualização |

**Índices:**
- customer_id (para buscar vendas por cliente)
- status (para filtrar por status)
- sale_date (para relatórios por período)

### 5. SALE_ITEMS (Itens de Venda)
Detalha cada produto em uma venda (tabela de junção).

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | INT | PK, AUTO_INCREMENT | Identificador único |
| sale_id | INT | FK → SALES | Referência à venda |
| product_id | INT | FK → PRODUCTS | Referência ao produto |
| quantity | INT | NOT NULL | Quantidade vendida |
| unit_price | FLOAT | NOT NULL | Preço unitário na época |
| subtotal | FLOAT | NOT NULL | Quantidade × Preço unitário |

**Índices:**
- sale_id (para buscar itens de uma venda)
- product_id (para análise de produtos mais vendidos)

## Relacionamentos

### 1:N CUSTOMERS → SALES
Um cliente pode ter múltiplas vendas.

### 1:N SALES → SALE_ITEMS
Uma venda pode ter múltiplos itens.

### 1:N PRODUCTS → SALE_ITEMS
Um produto pode estar em múltiplas vendas.

### 1:N PRODUCTS → STOCKS
Um produto pode ter múltiplos registros de estoque (por warehouse).

## Constraints de Integridade

```sql
-- FK Constraints
ALTER TABLE sales ADD CONSTRAINT fk_sales_customer
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT;

ALTER TABLE sale_items ADD CONSTRAINT fk_sale_items_sale
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE;

ALTER TABLE sale_items ADD CONSTRAINT fk_sale_items_product
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;

ALTER TABLE stocks ADD CONSTRAINT fk_stocks_product
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- UNIQUE Constraints
ALTER TABLE customers ADD CONSTRAINT uq_customer_cpf UNIQUE (cpf);
ALTER TABLE customers ADD CONSTRAINT uq_customer_email UNIQUE (email);
ALTER TABLE products ADD CONSTRAINT uq_product_sku UNIQUE (sku);

-- CHECK Constraints
ALTER TABLE products ADD CONSTRAINT chk_prices 
  CHECK (sale_price > 0 AND purchase_price > 0);

ALTER TABLE stocks ADD CONSTRAINT chk_quantity 
  CHECK (quantity >= 0);

ALTER TABLE sale_items ADD CONSTRAINT chk_sale_quantity 
  CHECK (quantity > 0 AND unit_price > 0);
```

## Índices para Performance

```sql
-- Busca por CPF (frequente em operações)
CREATE INDEX idx_customer_cpf ON customers(cpf);

-- Busca por SKU (operações diárias)
CREATE INDEX idx_product_sku ON products(sku);

-- Filtro por categoria
CREATE INDEX idx_product_category ON products(category);

-- Vendas por cliente
CREATE INDEX idx_sales_customer ON sales(customer_id);

-- Vendas por período
CREATE INDEX idx_sales_date ON sales(sale_date);

-- Estoque por produto
CREATE INDEX idx_stock_product ON stocks(product_id);

-- Itens de venda por venda
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);

-- Itens de venda por produto
CREATE INDEX idx_sale_items_product ON sale_items(product_id);
```

## Exemplo de Fluxo de Dados

```
1. Cliente (CUSTOMERS)
   └─ João Silva, CPF: 123.456.789-10
   
2. Produto (PRODUCTS)
   └─ Blusa P, SKU: BLUSA-001, Preço: R$ 59,90
   
3. Estoque (STOCKS)
   └─ 50 unidades no warehouse "Principal"
   
4. Venda (SALES)
   └─ ID: 1
       Customer: João Silva
       Data: 2024-01-15
       Status: Finalizada
   
5. Item da Venda (SALE_ITEMS)
   └─ Blusa P (SKU: BLUSA-001)
       Quantidade: 2
       Preço Unitário: R$ 59,90
       Subtotal: R$ 119,80
   
RESULTADO:
- Estoque reduzido de 50 para 48 unidades
- Venda registrada com valor total: R$ 119,80
- Vinculação automática entre Cliente, Produto e Estoque
```

## Nota sobre Integridade Referencial

Todas as operações mantêm integridade referencial:

- ✅ Não é possível vender produto que não existe
- ✅ Não é possível vender mais do que existe em estoque
- ✅ Não é possível cancelar venda sem restaurar estoque
- ✅ Não é possível deletar cliente com vendas registradas
- ✅ Todos os preços são validados (positivos)
- ✅ Todos os IDs são únicos e únicos

---

**Criado para:** ERP Morena Concept - Sistema de Gestão de Moda
