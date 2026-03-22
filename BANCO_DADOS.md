# BANCO DE DADOS SQL - ERP MORENA CONCEPT

## 📋 Opções de Banco de Dados

### 1. SQLite (Padrão - Mais Fácil)
- **Arquivo:** `erp_moda.db`
- **Instalação:** Nenhuma necessária
- **Ideal para:** Desenvolvimento, testes, pequenas empresas
- **Limitações:** Sem acesso remoto, sem multi-usuários simultâneos

**Usar SQLite:**
```
DATABASE_URL=sqlite:///./erp_moda.db
```

### 2. PostgreSQL (Recomendado para Produção)
- **Server:** PostgreSQL 13+
- **Ideal para:** Produção, múltiplos usuários, backup automático
- **Recursos:** Mais robusto e escalável

**Usar PostgreSQL:**
```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/erp_moda
```

---

## ✅ INSTALAÇÃO DO POSTGRESQL NO WINDOWS

### OPÇÃO 1: Download Direto

1. Acesse: https://www.postgresql.org/download/windows/
2. Clique em "Download the installer"
3. Escolha a versão mais recente (15 ou 14)
4. Execute o instalador
5. Configure:
   - **Port:** 5432 (padrão)
   - **Password:** Crie uma senha forte
   - **Username:** postgres
   - **Locale:** Portuguese (Brasil)

### OPÇÃO 2: Usando Chocolatey (se tiver instalado)

```powershell
choco install postgresql13
```

### OPÇÃO 3: Usando Docker (Recomendado)

Se tem Docker instalado, execute:

```powershell
docker run -d `
  --name postgres_erp `
  -e POSTGRES_USER=erp_user `
  -e POSTGRES_PASSWORD=erp_password123 `
  -e POSTGRES_DB=erp_moda `
  -p 5432:5432 `
  postgres:15-alpine
```

---

## 🔧 CONFIGURAÇÃO DO POSTGRESQL

### 1. Instalar pgAdmin (Gerenciador Visual)

**Via Windows:**
- Download: https://www.pgadmin.org/download/pgadmin-4-windows/
- Execute e siga as instruções

**Via PowerShell:**
```powershell
docker run -d `
  --name pgadmin `
  -e PGADMIN_DEFAULT_EMAIL=admin@admin.com `
  -e PGADMIN_DEFAULT_PASSWORD=admin `
  -p 5050:80 `
  dpage/pgadmin4
```

Acesse em: http://localhost:5050

### 2. Criar Banco de Dados Manualmente

**Usando SQL Shell (psql):**

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar usuário
CREATE USER erp_user WITH PASSWORD 'erp_password123';

# Criar banco de dados
CREATE DATABASE erp_moda OWNER erp_user;

# Dar permissões
GRANT ALL PRIVILEGES ON DATABASE erp_moda TO erp_user;

# Sair
\q
```

**Usando pgAdmin:**
1. Clique em "Servers" → "Create" → "Server"
2. Nome: ERP_Moda
3. Host: localhost, Port: 5432
4. Username: postgres, Password: (sua senha)
5. Conecte e crie o banco com a query acima

---

## 📝 CONFIGURAR ERP PARA USAR POSTGRESQL

### 1. Editar arquivo `.env`

```env
DATABASE_URL=postgresql://erp_user:erp_password123@localhost:5432/erp_moda
APP_NAME=ERP Morena Concept
DEBUG=False
```

### 2. Instalar driver PostgreSQL

```bash
pip install psycopg2-binary
```

### 3. Ejecutar a aplicação

```bash
python main.py
```

O SQLAlchemy criará automaticamente as tabelas!

---

## 🚀 USANDO DOCKER-COMPOSE (MAIS FÁCIL)

Se tem Docker instalado, é tudo automático:

```bash
docker-compose up
```

Isso inicia:
- PostgreSQL na porta 5432
- API FastAPI na porta 8000
- Banco pré-configurado

---

## 📊 ESTRUTURA DO BANCO DE DADOS

Após executar `main.py`, o banco conterá 5 tabelas:

```sql
-- Consultar tabelas (PostgreSQL)
\dt

-- Resultado esperado:
public | customers   | table
public | products    | table
public | sale_items  | table
public | sales       | table
public | stocks      | table
```

### Script de Criação SQL (Adicional)

Se preferir criar manualmente:

```sql
-- Tabela de Clientes
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    size VARCHAR(10) NOT NULL,
    color VARCHAR(30),
    purchase_price FLOAT NOT NULL,
    sale_price FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Estoque
CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER DEFAULT 0,
    warehouse VARCHAR(50) DEFAULT 'Principal',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Vendas
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount FLOAT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pendente',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Itens de Venda
CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL REFERENCES sales(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price FLOAT NOT NULL,
    subtotal FLOAT NOT NULL
);

-- Índices para Performance
CREATE INDEX idx_customer_cpf ON customers(cpf);
CREATE INDEX idx_product_sku ON products(sku);
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_stock_product ON stocks(product_id);
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);
```

---

## 🔐 BACKUP E RESTAURAÇÃO

### Backup (PostgreSQL)

```bash
# Usar pg_dump
pg_dump -U erp_user -d erp_moda > backup.sql

# Ou usando Docker
docker exec postgres_erp pg_dump -U erp_user erp_moda > backup.sql
```

### Restauração

```bash
# Restaurar de arquivo SQL
psql -U erp_user -d erp_moda < backup.sql

# Ou usando Docker
cat backup.sql | docker exec -i postgres_erp psql -U erp_user -d erp_moda
```

---

## 📈 OTIMIZAÇÕES RECOMENDADAS

### 1. Análise e Índices

```sql
-- Analisar performance de queries
EXPLAIN ANALYZE SELECT * FROM customers WHERE cpf = '12345678901';

-- Recriar índices se necessário
REINDEX DATABASE erp_moda;
```

### 2. Manutenção Periódica

```sql
-- Limpar espaço não utilizado
VACUUM ANALYZE;

-- Logs
TRUNCATE TABLE pg_log;
```

### 3. Configurações de Produção

Edit `postgresql.conf`:
```
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
```

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### ❌ Erro: "could not connect to server"
**Solução:**
- Verify PostgreSQL está rodando: `pg_isready -h localhost`
- Confirme DATABASE_URL em .env
- Check credenciais de usuário

### ❌ Erro: "relation 'customers' does not exist"
**Solução:**
- Execute `python main.py` para criar tabelas
- Ou rode o script SQL manualmente

### ❌ Erro: "FATAL: Ident authentication failed"
**Solução:**
- Edit `postgresql.conf`:
  ```
  host    all             all             127.0.0.1/32            md5
  ```
- Restart PostgreSQL

### ❌ Erro: "database 'erp_moda' does not exist"
**Solução:**
```sql
CREATE DATABASE erp_moda OWNER erp_user;
```

---

## ✨ DICAS FINAIS

1. **Desenvolvimento:** Use SQLite (mais rápido)
2. **Produção:** Use PostgreSQL (mais robusto)
3. **Backup:** Faça regularmente
4. **Logs:** Monitore regularmente
5. **Índices:** Crie baseado em queries frequentes

---

**Documentação:** PostgreSQL Official Docs
https://www.postgresql.org/docs/

---

**Gerado para:** ERP Morena Concept
