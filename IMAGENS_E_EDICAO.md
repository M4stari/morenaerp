# 📸 NOVAS FUNCIONALIDADES - IMAGENS E EDIÇÃO DE PRODUTOS

## ✨ Mudanças Implementadas

### 1️⃣ Campos de Imagem em Produtos

#### `image_url` - Campo novo em Product
- **Tipo:** String (URL ou base64)
- **Obrigatório:** Não
- **Uso:** Armazenar URL da imagem ou imagem codificada em base64
- **Exemplos:**
  - URL remota: `https://exemplo.com/imagem.jpg`
  - Placeholder: `https://via.placeholder.com/300x300?text=Blusa`
  - Base64: `data:image/jpeg;base64,/9j/4AAQSkZJR...`

### 2️⃣ Preços do Produto (Já existiam, apenas reforçando)

Cada produto tem:
- **`purchase_price`** - Preço de compra (custo)
- **`sale_price`** - Preço de venda (preço final)
- **Margem de lucro automática** = sale_price - purchase_price

---

## 🛠️ Como Usar - Endpoints

### ✏️ Criar Produto COM Imagem

```bash
POST /products/

{
  "name": "Blusa Premium Verão",
  "sku": "BLUSA-PREM-001",
  "description": "Blusa de seda premium para verão",
  "category": "Blusas",
  "size": "M",
  "color": "Azul Royal",
  "purchase_price": 45.00,
  "sale_price": 129.90,
  "image_url": "https://via.placeholder.com/300x300?text=Blusa+Premium"
}
```

### 📷 Atualizar Produto (inclusive imagem)

**Via produtos:**
```bash
PUT /products/{product_id}

{
  "image_url": "https://nova-imagem.com/blusa.jpg",
  "sale_price": 149.90,
  "category": "Blusas Premium"
}
```

**Via estoque (NOVO - Manutenção de Estoque):**
```bash
PUT /stocks/product/{product_id}/edit

{
  "name": "Blusa Premium Verão v2",
  "image_url": "https://nova-imagem.com/blusa-v2.jpg",
  "purchase_price": 48.00,
  "sale_price": 139.90,
  "description": "Versão atualizada",
  "category": "Blusas Premium",
  "size": "G",
  "color": "Azul Royal"
}
```

### 📊 Visualizar Detalhes do Produto (novo endpoint)

```bash
GET /stocks/product/{product_id}/details

Retorna:
{
  "id": 1,
  "name": "Blusa Premium",
  "sku": "BLUSA-PREM-001",
  "image_url": "https://...",
  "purchase_price": 45.00,
  "sale_price": 129.90,
  "total_quantity": 150,
  "profit_per_item": 84.90,
  "profit_margin_percent": 188.67,
  "category": "Blusas",
  "size": "M",
  "color": "Azul Royal",
  "created_at": "2026-03-21T10:00:00"
}
```

---

## 🔄 Fluxo Completo de Gestão

### Cenário: Atualizar Produto na Manutenção de Estoque

```
1. Gerente acessa: http://localhost:8000/docs
2. Busca: /stocks/product/{product_id}/details
3. Visualiza:
   - Dados atuais do produto
   - Preço de compra e venda
   - Imagem
   - Quantidade em estoque
   - Margem de lucro

4. Clica em: PUT /stocks/product/{product_id}/edit
5. Atualiza o que precisar:
   - Nome do produto
   - Imagem (nova foto)
   - Preço de compra
   - Preço de venda
   - Categoria
   - Tamanho
   - Cor
   - Descrição

6. Confirma a edição
7. Sistema atualiza no banco e retorna:
   - Confirmação de sucesso
   - Dados atualizados
   - Novos preços
```

---

## 📋 Novos Endpoints

### Editar Produto (Via Estoque)
```
PUT /stocks/product/{product_id}/edit

Descrição: Edita TODOS os dados do produto através da manutenção de estoque
Requer: product_id (URL)
Body: ProductUpdate schema (todos os campos opcionais)
Retorna: Confirmação + dados atualizados

Exemplo:
curl -X PUT "http://localhost:8000/stocks/product/1/edit" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Novo Nome\",
    \"image_url\": \"https://...\",
    \"purchase_price\": 50.00,
    \"sale_price\": 150.00
  }"
```

### Detalhes do Produto (Via Estoque)
```
GET /stocks/product/{product_id}/details

Descrição: Obtém informações completas do produto de forma integrada
Requer: product_id (URL)
Retorna: Informações completas incluindo:
         - Dados do produto
         - Total de estoque em todos os warehouses
         - Lucro por item
         - Margem de lucro (%)
         - Timestamps

Exemplo:
curl "http://localhost:8000/stocks/product/1/details"
```

---

## 🖼️ Como Adicionar Imagens

### Opção 1: URL Remota (Recomendado para iniciar)
```json
{
  "image_url": "https://via.placeholder.com/300x300?text=Meu+Produto"
}
```

### Opção 2: Host Externo
```json
{
  "image_url": "https://meuserver.com/imagens/blusa.jpg"
}
```

### Opção 3: Base64 Encoding
```json
{
  "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
}
```

### Opção 4: Placeholder Dinâmico
```json
{
  "image_url": "https://via.placeholder.com/300x300?text=Blusa+Verão"
}
```

---

## 💰 Análise de Preços

### Novo Endpoint com Cálculo Automático

```bash
GET /stocks/product/1/details
```

**Retorna:**
```json
{
  "purchase_price": 45.00,
  "sale_price": 129.90,
  "profit_per_item": 84.90,
  "profit_margin_percent": 188.67
}
```

**Explicação:**
- Profit per item = 129.90 - 45.00 = 84.90
- Profit margin = (84.90 / 45.00) × 100 = 188.67%

---

## 🔄 Schemas Atualizados

### ProductBase (Atualizado)
```python
class ProductBase(BaseModel):
    name: str
    sku: str
    description: Optional[str]
    category: str
    size: str
    color: Optional[str]
    purchase_price: float
    sale_price: float
    image_url: Optional[str]  # ← NOVO
```

### ProductUpdate (Atualizado)
```python
class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None
    purchase_price: Optional[float] = None
    sale_price: Optional[float] = None
    image_url: Optional[str] = None  # ← NOVO
```

---

## 🧪 Teste Rápido

### 1. Popule o banco com dados de teste
```bash
python seed_database.py
```

Agora todos os produtos têm imagens de placeholder.

### 2. Acesse a API
```
http://localhost:8000/docs
```

### 3. Teste os endpoints:

**Busque detalhes de um produto:**
```
GET /stocks/product/1/details
```

**Atualize a imagem:**
```
PUT /stocks/product/1/edit
{
  "image_url": "https://nova-imagem.com/blusa.jpg"
}
```

**Atualize o preço:**
```
PUT /stocks/product/1/edit
{
  "purchase_price": 50.00,
  "sale_price": 149.90
}
```

---

## 📂 Arquivos Modificados

1. **models.py** ✏️
   - Adicionado: `image_url` em Product

2. **schemas.py** ✏️
   - Adicionado: `image_url` em ProductBase
   - Adicionado: `image_url` em ProductUpdate

3. **routes_stocks.py** ✏️ 
   - Novo endpoint: `PUT /stocks/product/{product_id}/edit`
   - Novo endpoint: `GET /stocks/product/{product_id}/details`

4. **seed_database.py** ✏️
   - Adicionadas URLs de placeholder em todos os produtos

---

## 🎯 Casos de Uso

### Caso 1: Gerente atualiza foto do produto
```
1. Acessa /stocks/product/5/details
2. Vê a imagem atual
3. Clica em PUT /stocks/product/5/edit
4. Substitui a URL da imagem
5. Atualiza a descrição se necessário
6. Confirma
```

### Caso 2: Reajuste de preços
```
1. Acessa /stocks/product/10/details
2. Vê: purchase_price: 30, sale_price: 89.90
3. Margem: 199.67%
4. Clica em PUT /stocks/product/10/edit
5. Ajusta: purchase_price: 35, sale_price: 99.90
6. Nova margem: 185.43%
7. Confirma
```

### Caso 3: Reclassificação de produto
```
1. Acessa /stocks/product/8/details
2. Vê que está em "Blusas"
3. Clica em PUT /stocks/product/8/edit
4. Muda categoria para "Blusas Premium"
5. Muda size de M para G
6. Muda preço de venda
7. Confirma
```

---

## 🔒 Validações

Todos os campos têm validadores:

- ✅ `purchase_price` deve ser > 0
- ✅ `sale_price` deve ser > 0
- ✅ `name` deve ter 3-150 caracteres
- ✅ `sku` deve ser único
- ✅ `image_url` pode ser null
- ✅ Nenhum erro se não atualizar campo

---

## 📊 Exemplos com cURL

### Atualizar Produto (includindo imagem)
```bash
curl -X PUT "http://localhost:8000/stocks/product/1/edit" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Blusa Premium Nova",
    "image_url": "https://exemplo.com/blusa-nova.jpg",
    "purchase_price": 50.00,
    "sale_price": 149.90,
    "category": "Blusas Premium"
  }'
```

### Ver Detalhes Completos
```bash
curl "http://localhost:8000/stocks/product/1/details"
```

### Resposta (Pretty-printed)
```json
{
  "id": 1,
  "name": "Blusa Premium Nova",
  "sku": "BLUSA-PREM-001",
  "image_url": "https://exemplo.com/blusa-nova.jpg",
  "purchase_price": 50.00,
  "sale_price": 149.90,
  "category": "Blusas Premium",
  "size": "M",
  "color": "Azul Royal",
  "total_quantity": 150,
  "profit_per_item": 99.90,
  "profit_margin_percent": 199.80,
  "created_at": "2026-03-21T10:00:00",
  "updated_at": "2026-03-21T15:30:00"
}
```

---

## ✨ Resumo das Mudanças

| Funcionalidade | Antes | Depois |
|---|---|---|
| **Imagem no Produto** | ❌ Não tinha | ✅ Campo `image_url` |
| **Editar Produto** | Via `/products/{id}` | ✅ Via `/stocks/product/{id}/edit` |
| **Detalhes no Estoque** | Apenas quantidade | ✅ Dados completos + lucro calculado |
| **Preços** | ✅ Tinha | ✅ Continua + nova análise |
| **Interface** | - | ✅ Todos os novos dados no Swagger |

---

**Desenvolvido para:** Morena Concept
**Atualização:** 21 de Março de 2026
**Versão:** 1.1.0
