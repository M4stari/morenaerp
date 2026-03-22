# 🚀 QUICK START - ERP Morena v1.2.0

Guia rápido para começar a usar o ERP Morena Concept imediatamente.

## ⚡ Instalação Rápida (5 minutos)

### 🔧 Backend (Terminal 1)

```bash
# Navegue até a pasta do projeto
cd "c:\ERP MORENA CONCEPT"

# Instale as dependências
pip install -r requirements.txt

# Inicie o servidor
python main.py
```

✅ Se vir "Uvicorn running on http://127.0.0.1:8000" → Backend OK!

### 💻 Frontend (Terminal 2)

```bash
# Navegue até a pasta frontend
cd "c:\ERP MORENA CONCEPT\frontend"

# Instale as dependências
npm install

# Inicie o dev server
npm run dev
```

✅ Se vir "Local: http://localhost:5173/" → Frontend OK!

---

## 🔓 Login

Abra `http://localhost:5173` no navegador

**Credenciais de Teste:**
```
Email: admin@morena.com
Senha: admin123
```

---

## 📚 8 Funcionalidades Principais

### 1. 📊 Dashboard
- **URL:** `/dashboard` ou `/`
- **O que faz:** Visão geral com 4 cards principais
- **Atalhos rápidos:** Para todos os módulos

### 2. 👥 Clientes
- **URL:** `/customers`
- **O que faz:** CRUD de clientes, busca, adicionar/editar/deletar
- **Atalho:** Dashboard → "👥 Clientes"

### 3. 📦 Produtos
- **URL:** `/products`
- **O que faz:** Catálogo com grid, busca, filtro, CRUD
- **Destaque:** Mostrar lucro e imagens

### 4. 📊 Estoque
- **URL:** `/inventory`
- **O que faz:** Movimentações de estoque, status visual, exportar CSV
- **Botões:** Entrada/Saída/Ajuste, Filtrar, CSV

### 5. 💰 Vendas
- **URL:** `/sales`
- **O que faz:** Criar vendas com carrinho, incluir cliente e produtos
- **Fluxo:** Cliente → Produtos → Carrinho → Confirmar

### 6. 📈 Relatórios
- **URL:** `/reports`
- **O que faz:** Gráficos, estatísticas, tabelas, exportar
- **Gráficos:** Vendas por dia, produtos vendidos, estoque

### 7. 🔐 Autenticação
- **URL:** `/login`
- **O que faz:** Login e proteção de rotas
- **Logout:** Clique em seu nome → "Sair"

### 8. 🌙 Tema Claro/Escuro
- **Localização:** Botão na navbar (🌙/☀️)
- **O que faz:** Alterna entre temas
- **Salvo:** Automaticamente em localStorage

---

## 🎮 Primeiras Ações (Próximos 10 minutos)

### 1. Explorar Dashboard (1 min)
```
http://localhost:5173/dashboard
```
- Veja os 4 cards com números
- Clique nos atalhos para explorar

### 2. Adicionar Cliente (2 min)
```
Dashboard → 👥 Clientes
```
- Clique em "+ Novo Cliente"
- Preencha: Nome, E-mail, CPF, Telefone
- Clique em "Salvar"

### 3. Verificar Produtos (1 min)
```
Dashboard → 📦 Produtos
```
- Veja grid com 32 produtos
- Busque por nome
- Filtre por categoria

### 4. Fazer uma Venda (3 min)
```
Dashboard → 💰 Vendas
```
- Selecione um cliente
- Procure um produto
- Clique em "➕" para adicionar
- Revise no carrinho
- Clique em "Confirmar Venda"

### 5. Ver Relatórios (2 min)
```
Dashboard → 📊 Relatórios
```
- Selecione período
- Clique em "Filtrar"
- Explore gráficos
- Exporte em CSV ou PDF

### 6. Alternar Tema (30 seg)
```
Navbar → 🌙 button
```
- Clique para alternar
- Observe as cores mudarem

---

## 📁 Exportar Dados

### CSV (Estoque)
1. Vá para Estoque
2. Clique em "📥 CSV"
3. Arquivo baixa automaticamente

### PDF (Relatórios)
1. Vá para Relatórios
2. Aplique filtros desejados
3. Clique em "📋 PDF"
4. Arquivo é gerado e baixa

---

## 🔐 Autenticação

**Como Funciona:**
1. Login em `/login`
2. Recebe JWT token
3. Token armazenado em localStorage
4. Automaticamente incluído em requisições
5. Expira em 30 minutos
6. Sair limpa tudo

**Se Token Expirar:**
- Será redirecionado automaticamente ao login
- Faça login novamente

---

## 🐛 Troubleshooting Rápido

### Backend não sobe
```bash
pip install -r requirements.txt
python main.py
```

### Frontend não inicia
```bash
cd frontend && npm install && npm run dev
```

### CORS error
- Certifique frontend está em `localhost:5173`
- Backend aceita todos os origins

### Não consegue fazer login
- Use: `admin@morena.com` / `admin123`
- Verifique se backend está rodando

### Notificações não aparecem
- Recarregue a página (F5)
- Verifique console do navegador

### Tema não muda
- Clique novamente no botão 🌙/☀️
- Limpe localStorage e tente novamente

---

## 📱 Responsividade

Sistema é **100% responsivo**:
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

Menu se adapta automaticamente em dispositivos pequenos.

---

## 🎨 Cores Principais

| Nome | Hex | Uso |
|------|-----|-----|
| Morena | #b8765a | Primária |
| Success | #10b981 | Sucesso |
| Error | #ef4444 | Erro |
| Warning | #f59e0b | Aviso |
| Info | #3b82f6 | Informação |

---

## 📊 Dados de Teste

Sistema vem com:
- ✅ 32 produtos pré-carregados
- ✅ 2 usuários de teste
- ✅ 5 clientes de exemplo
- ✅ Estoque com quantidades variadas

---

## 🔄 Workflow Recomendado

```
1. Dashboard
   ↓
2. Adicionar Cliente (se novo)
   ↓
3. Verificar Estoque
   ↓
4. Fazer Vendas
   ↓
5. Ver Relatórios
   ↓
6. Exportar (CSV/PDF)
```

---

## 📞 Próximos Passos

1. **Ler Documentação Completa:**
   - Arquivo: `FINAL_DOCUMENTATION.md`
   - Detalhes de cada feature

2. **Explorar API:**
   - http://localhost:8000/docs (Swagger)
   - http://localhost:8000/redoc (ReDoc)

3. **Customizar:**
   - Cores em `frontend/tailwind.config.js`
   - Lógica em `main.py` (backend)
   - Componentes em `frontend/src/`

4. **Deploy:**
   - Backend: Heroku, Railway, Render
   - Frontend: Vercel, Netlify, AWS S3

---

**Pronto para usar! 🎉**

Qualquer dúvida, consulte `FINAL_DOCUMENTATION.md`

**Última atualização:** 2026  
**Versão:** 1.2.0  
**Status:** ✅ Production Ready
