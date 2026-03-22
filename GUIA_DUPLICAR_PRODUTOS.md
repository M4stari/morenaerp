# 🔄 NOVA FEATURE: DUPLICAR PRODUTOS

## Resumo

Agora você pode **duplicar produtos existentes** para criar variações rapidamente! Perfeito para criar cores, tamanhos e versões diferentes do mesmo item.

---

## 📋 Endpoint

```
POST /products/{product_id}/duplicate
```

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `product_id` | int | ✅ Sim | ID do produto a duplicar (na URL) |
| `new_sku` | string | ✅ Sim | SKU único para o novo produto |
| `new_name` | string | ❌ Não | Nome do novo produto (se diferente) |
| `new_color` | string | ❌ Não | Cor do novo produto (se diferente) |
| `new_size` | string | ❌ Não | Tamanho do novo produto (se diferente) |

### Resposta

```json
{
  "id": 12,
  "name": "Blusa Básica",
  "sku": "BLUSA-AZUL",
  "category": "Camisetas e Blusas",
  "color": "Azul",
  "size": "M",
  "description": "Blusa confortável",
  "purchase_price": 25.00,
  "sale_price": 79.90,
  "image_url": "https://...",
  "created_at": "2024-01-15T10:30:00"
}
```

---

## 🎯 Casos de Uso

### 1️⃣ Criar Variação de Cor

Você tem uma blusa básica preta. Quer a mesma em azul:

```bash
POST /products/1/duplicate?new_sku=BLUSA-AZUL&new_color=Azul
```

**Resultado:** Nova blusa com as mesmas características, mas cor azul e SKU diferente.

### 2️⃣ Criar Variação de Tamanho

Mesma blusa em tamanho GG:

```bash
POST /products/1/duplicate?new_sku=BLUSA-P-GG&new_size=GG
```

### 3️⃣ Criar com Múltiplas Variações

Blusa de cor e tamanho diferentes, com novo nome:

```bash
POST /products/1/duplicate?new_sku=BLUSA-PINK-P&new_name=Blusa Rosa Tamanho P&new_color=Rosa&new_size=P
```

### 4️⃣ Criar Matriz (cores × tamanhos)

**Automático:** Execute `exemplos_duplicar_produto.py` - função `criar_matriz_completa()`

Cria 9 produtos:
- 3 cores × 3 tamanhos
- SKU único para cada combinação
- Todos com características copiadas

---

## 💡 Exemplo Prático com cURL

### Duplicar com cor diferente:

```bash
curl -X POST "http://localhost:8000/products/1/duplicate?new_sku=CALCA-AZUL&new_color=Azul"
```

### Duplicar com tamanho diferente:

```bash
curl -X POST "http://localhost:8000/products/1/duplicate?new_sku=CALCA-TAMANHO-GG&new_size=GG"
```

### Duplicar com tudo diferente:

```bash
curl -X POST "http://localhost:8000/products/1/duplicate?new_sku=CALCA-AZUL-GG&new_name=Calça Azul Tamanho GG&new_color=Azul&new_size=GG"
```

---

## 🔍 Validações

✅ **SKU deve ser único** - Não pode duplicar um SKU existente

❌ **Produto não existe** - Se o `product_id` não existir, retorna erro 404

✅ **Todos os campos são copiados:**
- Categoria
- Descrição
- Preço de compra
- Preço de venda
- Imagem (URL)

---

## 📊 Fluxo Recomendado

```
1. Criar produto "base"
   ↓
2. Consultar detalhes
   ↓
3. Duplicar para cada variação
   ↓
4. Usar Editar para ajustes finos (se necessário)
   ↓
5. Adicionar ao estoque
```

---

## 🚀 Uso via Swagger

1. Rode a API: `python main.py`
2. Acesse: `http://localhost:8000/docs`
3. Procure por: **POST /products/{product_id}/duplicate**
4. Teste com um ID existente

---

## 📝 Exemplos de Código

### Python

```python
import requests

url = "http://localhost:8000/products/1/duplicate"
params = {
    "new_sku": "BLUSA-AZUL-M",
    "new_color": "Azul",
    "new_size": "M"
}

resposta = requests.post(url, params=params)
novo_produto = resposta.json()
print(f"Novo produto ID: {novo_produto['id']}")
```

### JavaScript/Node

```javascript
const response = await fetch('http://localhost:8000/products/1/duplicate?new_sku=BLUSA-AZUL&new_color=Azul', {
  method: 'POST'
});
const novoProduto = await response.json();
console.log(`Novo ID: ${novoProduto.id}`);
```

---

## 💾 Arquivo de Exemplos

Veja: `exemplos_duplicar_produto.py`

Contém:
- ✅ Duplicação simples
- ✅ Duplicação com cor
- ✅ Duplicação com tamanho
- ✅ Duplicação completa
- ✅ Criar matriz cores × tamanhos

Execute:
```bash
python exemplos_duplicar_produto.py
```

---

## 🎨 Caso Real: Loja de Moda

**Situação:** Você vende uma blusa básica em 3 cores (preto, azul, rosa) e 4 tamanhos (P, M, G, GG).

**Antes:** 12 registros manuais com digitação repetitiva

**Depois:** 1 comando cria a matriz completa!

```bash
# Criar produto base
POST /products/
  name: "Blusa Básica"
  sku: "BLUSA-BASIC"
  purchase_price: 25
  sale_price: 79.90

# Criar variações (1 clique cada)
POST /products/1/duplicate?new_sku=BLUSA-PRETO-P&new_color=Preto&new_size=P
POST /products/1/duplicate?new_sku=BLUSA-PRETO-M&new_color=Preto&new_size=M
... (10 mais)
```

**Resultado:** 12 produtos com SKU único, cores, tamanhos - pronto para estoque!

---

## ⚠️ Observações

1. **SKU é obrigatório** - Cada produto precisa de um SKU único
2. **Preços são copiados** - Se precisar ajustá-los, use PUT /products/{id}/
3. **Imagem é copiada** - Mesma URL da original
4. **Estoque inicialmente vazio** - Use POST /stocks/ para adicionar quantidade
5. **Sem limite** - Crie quantas variações precisar!

---

## 🔄 Versão

- **Versão:** 1.1.1
- **Data:** Jan 2024
- **Adicionado em:** Esta sessão
- **Status:** ✅ Pronto para produção

---

## 📞 Próximos Passos

1. Teste a nova feature no Swagger UI
2. Use `exemplos_duplicar_produto.py` para batch operations
3. Integre com seu sistema de frontend
4. Considere adicionar autenticação (JWT) para produção
