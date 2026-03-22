# ⚡ QUICK START: DUPLICAR PRODUTOS

Guia rápido para usar a nova feature de duplicação de produtos!

---

## 🚀 Em 30 Segundos

1. **Tenha um produto existente** (ex: ID = 1)
2. **Faça um POST simples:**
   ```
   POST /products/1/duplicate?new_sku=NOVO-SKU
   ```
3. **Pronto!** Novo produto criado com SKU único

---

## 📋 3 Casos Mais Comuns

### 1. Criar Cor Diferente
```bash
# Mesmo produto, cor azul
POST /products/1/duplicate?new_sku=BLUSA-AZUL&new_color=Azul
```

### 2. Criar Tamanho Diferente
```bash
# Mesmo produto, tamanho GG
POST /products/1/duplicate?new_sku=BLUSA-GG&new_size=GG
```

### 3. Criar Matriz (Cores × Tamanhos)
```bash
# Via Python script
python exemplos_duplicar_produto.py
# (funcão: criar_matriz_completa)
```

---

## 🎨 Exemplo Real: Blusa em 3 Cores

```bash
# Original
POST /products/1 → ID 1, SKU "BLUSA", cor "Branco"

# Cor 1: Azul
POST /products/1/duplicate?new_sku=BLUSA-AZUL&new_color=Azul

# Cor 2: Preto  
POST /products/1/duplicate?new_sku=BLUSA-PRETO&new_color=Preto

# Cor 3: Rosa
POST /products/1/duplicate?new_sku=BLUSA-ROSA&new_color=Rosa

# Resultado: 4 produtos (original + 3 variações)
```

---

## 💡 O Que É Copiado?

✅ Copiado automaticamente:
- Nome (exceto se `new_name`)
- Categoria
- Descrição
- Preço de compra
- Preço de venda
- Imagem (URL)
- Cor (exceto se `new_color`)
- Tamanho (exceto se `new_size`)

❌ NÃO copiado:
- SKU (deve ser novo)
- ID (novo produto )
- Data de criação (gera nova)

---

## 📝 Parâmetros

| Parâmetro | Obrigatório | Tipo | Exemplo |
|-----------|-----------|------|---------|
| product_id | ✅ | URL | `/products/1/...` |
| new_sku | ✅ | Query | `?new_sku=BLUSA-AZUL` |
| new_name | ❌ | Query | `?new_name=Blusa Azul` |
| new_color | ❌ | Query | `?new_color=Azul` |
| new_size | ❌ | Query | `?new_size=G` |

---

## 🔧 Teste no Swagger

1. `python main.py`
2. http://localhost:8000/docs
3. Procure: **POST /products/{product_id}/duplicate**
4. Clique em "Try it out"
5. Coloque ID do produto + novo SKU
6. Execute!

---

## 🐍 Teste em Python

```python
import requests

BASE_URL = "http://localhost:8000"

# Duplicar produto 1 com novo SKU
response = requests.post(
    f"{BASE_URL}/products/1/duplicate",
    params={
        "new_sku": "BLUSA-AZUL",
        "new_color": "Azul"
    }
)

novo = response.json()
print(f"✅ Novo ID: {novo['id']}")
print(f"✅ SKU: {novo['sku']}")
print(f"✅ Cor: {novo['color']}")
```

---

## 🐚 Teste com cURL

```bash
# Simples
curl -X POST "http://localhost:8000/products/1/duplicate?new_sku=BLUSA-COPIA"

# Com cor
curl -X POST "http://localhost:8000/products/1/duplicate?new_sku=BLUSA-AZUL&new_color=Azul"

# Com tudo
curl -X POST "http://localhost:8000/products/1/duplicate?new_sku=BLUSA-PINK-P&new_color=Rosa&new_size=P&new_name=Blusa rosa tamanho P"
```

---

## ⚠️ Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| 404 Not Found | Produto não existe | Use ID válido |
| 400 Bad Request | SKU duplicado | Use novo SKU único |
| 422 Validation Error | Parâmetro inválido | Verifique sintaxe |

---

## 📚 Docs Completas

Veja: **GUIA_DUPLICAR_PRODUTOS.md**

Inclui:
- ✅ 7 casos de uso
- ✅ Exemplos práticos
- ✅ Batch operations
- ✅ FAQ

---

## 🎯 Próximo Passo

Crie sua primeira variação:

```bash
1. Identifique ID de um produto
2. Cole no navegador:
   http://localhost:8000/docs
3. Teste POST /products/{id}/duplicate
```

**Pronto!** 🚀

---

*Versão 1.1.1 - Duplicação de Produtos*
