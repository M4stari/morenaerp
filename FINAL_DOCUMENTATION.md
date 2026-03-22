# 📚 Documentação Completa - ERP Morena Concept v1.2.0

## 🎯 Visão Geral

**ERP Morena Concept** é um sistema completo de gerenciamento de vendas para indústria de moda, desenvolvido com FastAPI (backend) e Vue 3 (frontend), oferecendo gestão de clientes, produtos, estoque e vendas.

**Versão:** 1.2.0  
**Status:** Production Ready  
**Data:** 2026

---

## ✨ 8 Funcionalidades Principais Implementadas

### 1. 📋 Página de Estoque Avançada (Inventory)

**Localização:** `/inventory`

**Recursos:**
- ✅ Tabela em tempo real com todos os produtos e quantidades
- ✅ Filtros por status (Zerado, Baixo, OK)
- ✅ Busca por nome de produto
- ✅ Cards de estatísticas (Total, Em Estoque, Baixo Estoque, Zerado)
- ✅ Formulário de movimentação (entrada/saída/ajuste)
- ✅ Notas por movimento
- ✅ Exportação para CSV com timestamp
- ✅ Status visual com cores (🔴 Zerado, 🟡 Baixo, 🟢 OK)

**API Endpoints Utilizados:**
```
GET /stocks/          - Listar todos os estoques
GET /stocks/{id}      - Obter estoque específico
POST /stocks/{id}/add - Adicionar quantidade
POST /stocks/{id}/remove - Remover quantidade
PUT /stocks/{id}      - Atualizar estoque
```

**Como Usar:**
1. Acesse Dashboard → Estoque
2. Visualize status atual de todos os produtos
3. Use filtros para encontrar produtos específicos
4. Clique em "Movimentação" para adicionar/remover estoque
5. Exporte dados em CSV clicando em "📥 CSV"

---

### 2. 🛒 Sistema de Vendas com Carrinho

**Localização:** `/sales`

**Recursos:**
- ✅ Seletor de cliente (dropdown com filtro)
- ✅ Busca e adição de produtos ao carrinho
- ✅ Quantity picker com botões +/- 
- ✅ Cálculo automático de subtotal, desconto e total
- ✅ Carrinho lateral com preview
- ✅ Remoção de itens
- ✅ Aplicação de desconto (valor fixo)
- ✅ Observações de venda
- ✅ Tabela de vendas recentes com cliente e total
- ✅ Confirmação e reset do carrinho

**API Endpoints Utilizados:**
```
GET /customers/       - Listar clientes
GET /products/        - Listar produtos
POST /sales/          - Criar nova venda
GET /sales/           - Listar vendas
```

**Estrutura de Requisição de Venda:**
```json
{
  "customer_id": 1,
  "total": 150.00,
  "discount": 10.00,
  "notes": "Cliente solicitou embrulho de presente",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "unit_price": 75.00
    }
  ]
}
```

**Como Usar:**
1. Acesse Dashboard → Vendas
2. Selecione um cliente no dropdown
3. Procure e selecione produtos
4. Ajuste quantidades com +/-
5. Aplique desconto se necessário
6. Revise o carrinho no painel lateral
7. Clique em "Confirmar Venda"

---

### 3. 📊 Sistema de Relatórios com Gráficos

**Localização:** `/reports`

**Recursos:**
- ✅ 4 Cards de estatísticas (Total Vendas, Qtd Vendas, Ticket Médio, Produtos em Estoque)
- ✅ Filtro por data (período inicial e final)
- ✅ Gráfico de linha: Vendas por dia
- ✅ Gráfico de rosca: Distribuição de produtos vendidos
- ✅ Visualização de status de estoque (progresso com cores)
- ✅ Top 5 clientes por valor gasto
- ✅ Tabela detalhada de todas as vendas do período
- ✅ Exportação para CSV
- ✅ Exportação para PDF

**Gráficos Implementados:**
- **Linha**: Evolução de vendas por dia (Chart.js)
- **Rosca**: Top 8 produtos mais vendidos
- **Barras de Progresso**: Status de estoque visual

**Como Usar:**
1. Acesse Dashboard → Relatórios
2. Selecione período (data inicial e final)
3. Clique em "Filtrar" para atualizar dados
4. Analise gráficos e estatísticas
5. Exporte em CSV (📊 CSV) ou PDF (📋 PDF)
6. Scroll down para ver tabela detalhada

---

### 4. 🔐 Autenticação JWT

**Localização:** `/login`

**Recursos:**
- ✅ Login com email/senha
- ✅ Geração de JWT token
- ✅ Token armazenado em localStorage
- ✅ Proteção de rotas (apenas usuários autenticados)
- ✅ Logout com limpeza de dados
- ✅ Interceptor automático para adicionar token em requisições
- ✅ Redirecionamento automático ao login se token expirado
- ✅ Exibição de informações do usuário na navbar

**Credenciais de Teste:**
```
Email: admin@morena.com
Senha: admin123

Email: vendedor@morena.com
Senha: vendedor123
```

**Flow de Autenticação:**
1. Usuário acessa `/login`
2. Insere email e senha
3. Backend valida e retorna `access_token`
4. Token é armazenado em `localStorage`
5. Todas as rotas protegidas verificam se há token válido
6. Interceptor adiciona token em header `Authorization: Bearer {token}`

**Token JWT Inclui:**
```json
{
  "email": "admin@morena.com",
  "id": 1,
  "exp": 1234567890
}
```

**Como Usar:**
1. Será redirecionado automaticamente ao login se não autenticado
2. Insira credenciais de teste
3. Será redirecionado ao Dashboard após sucesso
4. Token permanece ativo por 30 minutos
5. Clique em "Sair" na navbar para logout

**Arquivos Relacionados:**
- Backend: `/routes_auth.py` - Endpoints de autenticação
- Frontend: `/src/stores/authStore.js` - State management
- Frontend: `/src/views/Login.vue` - Página de login

---

### 5. 🌙 Tema Claro / Escuro

**Localização:** Botão na Navbar (🌙/☀️)

**Recursos:**
- ✅ Toggle entre tema claro e escuro
- ✅ Persistência em localStorage
- ✅ Transição suave entre temas
- ✅ Aplicado a todos os componentes
- ✅ Cores otimizadas para cada tema
- ✅ Suporte a preferências do sistema (CSS prefers-color-scheme)

**Classes Tailwind Usadas:**
- `dark:` - Classes aplicadas no modo escuro
- `transition-colors duration-300` - Transição suave

**Temas:**
| Elemento | Claro | Escuro |
|----------|-------|--------|
| Background | `from-gray-50 to-gray-100` | `from-gray-900 to-gray-800` |
| Cards | Branco | `gray-800` |
| Texto | Preto | Branco |
| Navbar | Morena-700 a 900 | Gray-950 |

**Como Usar:**
1. Clique no ícone 🌙/☀️ na navbar
2. Tema muda instantaneamente
3. Preferência é salva automaticamente
4. Ao retornar, tema salvo é aplicado

**Arquivos Relacionados:**
- `/src/stores/themeStore.js` - State management
- `/tailwind.config.js` - Configuração dark mode
- `/src/App.vue` - Aplicação global de tema

---

### 6. 📁 Exportação para CSV e PDF

**Localização:** Botões em Estoque e Relatórios

**Recursos CSV:**
- ✅ Exportação de todos os dados em formato CSV
- ✅ Separador de campos: vírgula
- ✅ Valores booleanos e datas formatados
- ✅ Suporta caracteres especiais (acentos)
- ✅ Nome de arquivo com timestamp

**Recursos PDF:**
- ✅ Relatórios em PDF formatado
- ✅ Tabelas com cabeçalhos estilizados (cores Morena)
- ✅ Paginação automática para grandes relatórios
- ✅ Data de geração no documento
- ✅ Linhas alternadas para melhor legibilidade

**Exemplos de Exportação:**

**CSV de Estoque:**
```csv
"ID","Produto","SKU","Quantidade","Status","Valor Total"
"1","Vestido Floral","VES-001","15","OK","R$ 450.00"
"2","Jaqueta Jeans","JAQ-001","3","Baixo","R$ 57.00"
```

**PDF de Relatórios:**
- Título: "Relatório de Vendas"
- Data de geração
- Tabela com ID, Cliente, Total, Data
- Paginação automática

**Como Usar:**

**Estoque:**
1. Acesse Estoque
2. Aplique filtros desejados
3. Clique em "📥 CSV"
4. Arquivo será baixado automaticamente

**Relatórios:**
1. Acesse Relatórios
2. Selecione período
3. Clique em "📊 CSV" ou "📋 PDF"
4. Arquivo será gerado e baixado

**Bibliotecas Usadas:**
- `jsPDF` - Geração de PDFs
- `html2canvas` - Conversão de HTML para imagem (PDFs complexos)

---

### 7. 🔔 Notificações em Tempo Real

**Localização:** Canto superior direito da tela

**Recursos:**
- ✅ Notificações toast (popups não-intrusivos)
- ✅ 4 tipos: Success (verde), Error (vermelho), Info (azul), Warning (amarelo)
- ✅ Auto-desaparecimento após 3-5 segundos
- ✅ Botão X para fechar manual
- ✅ Animação de entrada/saída suave
- ✅ Integração automática com API (POST/PUT/DELETE)
- ✅ Múltiplas notificações simultâneas

**Exemplos de Notificações:**

```
✅ Ação realizada com sucesso! (Success - 3s)
❌ Email inválido (Error - 5s)
⚠️ Estoque baixo para este produto (Warning - 4s)
ℹ️ Dados carregados (Info - 3s)
```

**Tipos de Notificação:**
| Tipo | Cor | Duração | Trigger |
|------|-----|---------|---------|
| `success` | 🟢 Verde | 3s | POST/PUT/DELETE sucesso |
| `error` | 🔴 Vermelho | 5s | Erro de validação ou servidor |
| `warning` | 🟡 Amarelo | 4s | Avisos de negócio |
| `info` | 🔵 Azul | 3s | Informações gerais |

**Integração Automática:**
```javascript
// API interceptor mostra notificações automaticamente
- Sucesso em requisições POST/PUT/DELETE
- Erros de validação (400, 422)
- Erros de servidor (500)
- Erros de autenticação (401)
```

**Como Usar Manualmente:**
```javascript
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()

// Notificação com duração padrão (5s)
notificationStore.addNotification('Operação concluída!', 'success')

// Notificação com duração customizada
notificationStore.addNotification('Aviso importante', 'warning', 7000)

// Notificação com duração infinita
notificationStore.addNotification('Mensagem importante', 'info', 0)
```

**Arquivos Relacionados:**
- `/src/stores/notificationStore.js` - State management
- `/src/components/NotificationCenter.vue` - UI
- `/src/api/client.js` - Integração com API

---

### 8. 📝 Documentação Completa

**Conteúdo Incluído:**

1. **Este Arquivo** (`FINAL_DOCUMENTATION.md`)
   - Visão geral de todas as 8 funcionalidades
   - Guias de uso de cada feature
   - Exemplos de API
   - Troubleshooting

2. **README.md** - Guia geral do projeto
3. **CHANGELOG.md** - Histórico de versões
4. **QUICK_START.md** - Início rápido
5. **GUIA_DUPLICAR_PRODUTOS.md** - Feature de duplicação
6. **Setup e Instalação** - Documentado em cada seção

---

## 🏗️ Arquitetura do Sistema

### Backend (FastAPI)

```
├── main.py                 # Aplicação principal
├── models.py              # Modelos SQLAlchemy (Customer, Product, Stock, Sale, SaleItem)
├── schemas.py             # Schemas Pydantic (validação de dados)
├── database.py            # Configuração SQLAlchemy
├── config.py              # Variáveis de configuração
├── routes_auth.py         # Autenticação JWT (NOVO)
├── routes_customers.py    # Endpoints de clientes
├── routes_products.py     # Endpoints de produtos
├── routes_stocks.py       # Endpoints de estoque
├── routes_sales.py        # Endpoints de vendas
├── requirements.txt       # Dependências Python
└── .env                   # Variáveis de ambiente
```

**Tecnologias Backend:**
- FastAPI 0.104.1
- SQLAlchemy 2.0.23
- Pydantic 2.5.0
- PyJWT 2.8.1 (autenticação)
- Python-dotenv 1.0.0
- CORS habilitado para frontend local

### Frontend (Vue 3)

```
src/
├── main.js                              # Ponto de entrada
├── App.vue                              # Componente raiz
├── router.js                            # Roteamento + Auth Guard
├── index.css                            # Estilos globais
├── api/
│   └── client.js                        # Cliente Axios + Interceptors
├── components/
│   ├── Navbar.vue                       # Navbar com menu e user dropdown
│   ├── Alert.vue                        # Componente de alertas
│   ├── StatCard.vue                     # Card de estatísticas
│   ├── CustomerForm.vue                 # Form de cliente
│   └── NotificationCenter.vue           # Centro de notificações (NOVO)
├── stores/
│   ├── authStore.js                     # Pinia: Autenticação (NOVO)
│   ├── themeStore.js                    # Pinia: Tema (NOVO)
│   ├── notificationStore.js             # Pinia: Notificações (NOVO)
│   ├── customerStore.js                 # Pinia: Clientes
│   └── productStore.js                  # Pinia: Produtos
├── views/
│   ├── Login.vue                        # Página de login (NOVO)
│   ├── Dashboard.vue                    # Dashboard inicial
│   ├── Customers.vue                    # Gestão de clientes
│   ├── Products.vue                     # Catálogo de produtos
│   ├── Inventory.vue                    # Gestão de estoque
│   ├── Sales.vue                        # Sistema de vendas (NOVO)
│   └── Reports.vue                      # Relatórios e gráficos (NOVO)
└── utils/
    └── exportUtils.js                   # Utilitários de exportação (NOVO)

Configuration Files:
├── package.json                         # Dependências Node
├── vite.config.js                       # Configuração Vite
├── tailwind.config.js                   # Configuração Tailwind + darkMode (ATUALIZADO)
├── postcss.config.js                    # PostCSS (CORRIGIDO para ES Modules)
└── index.html                           # HTML raiz
```

**Tecnologias Frontend:**
- Vue 3.3.7
- Vite 5.0.5
- Vue Router 4.2.5
- Pinia 2.1.6
- Axios 1.6.0
- Tailwind CSS 3.3.6
- Chart.js 4.4.0
- vue-chartjs 5.2.0
- jsPDF 2.5.1
- html2canvas 1.4.1

---

## 🗄️ Banco de Dados

### Tabelas

**Customers** (Clientes)
```
- id          (Integer, PK)
- name        (String)
- email       (String, unique)
- cpf         (String, unique)
- phone       (String)
- address     (String)
- city        (String)
- state       (String)
- created_at  (DateTime)
- updated_at  (DateTime)
```

**Products** (Produtos)
```
- id              (Integer, PK)
- name            (String)
- sku             (String, unique)
- description     (String)
- category        (String)
- purchase_price  (Decimal)
- sale_price      (Decimal)
- image_url       (String)
- created_at      (DateTime)
- updated_at      (DateTime)
```

**Stocks** (Estoques)
```
- id          (Integer, PK)
- product_id  (Integer, FK→Products)
- quantity    (Integer)
- created_at  (DateTime)
- updated_at  (DateTime)
```

**Sales** (Vendas)
```
- id           (Integer, PK)
- customer_id  (Integer, FK→Customers)
- total        (Decimal)
- discount     (Decimal)
- notes        (String)
- status       (String: pending/finalized)
- created_at   (DateTime)
- updated_at   (DateTime)
```

**Sale Items** (Itens de Venda)
```
- id          (Integer, PK)
- sale_id     (Integer, FK→Sales)
- product_id  (Integer, FK→Products)
- quantity    (Integer)
- unit_price  (Decimal)
- created_at  (DateTime)
```

---

## 🚀 Como Usar

### Primeira Execução

**1. Backend:**
```bash
cd "c:\ERP MORENA CONCEPT"
pip install -r requirements.txt
python main.py
```

**2. Frontend:**
```bash
cd "c:\ERP MORENA CONCEPT\frontend"
npm install
npm run dev
```

**3. Acessar:**
- Frontend: `http://localhost:5173`
- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`

### Login

```
Email: admin@morena.com
Senha: admin123
```

### Guia por Módulo

**Dashboard** (`/dashboard` ou `/`)
- Visão rápida de clientes, produtos, estoque e vendas
- 4 cards com números principais
- 4 atalhos para módulos principais

**Clientes** (`/customers`)
- Tabela com todos os clientes
- Busca por nome
- Criar novo cliente
- Editar cliente
- Deletar cliente

**Produtos** (`/products`)
- Grid de produtos com imagens
- Busca e filtro por categoria
- Visualizar lucro por produto
- Criar novo produto
- Editar produto
- Deletar produto
- Duplicar produto com parâmetros

**Estoque** (`/inventory`)
- Tabela com status visual (cores)
- Busca e filtro por status
- Movimentações (entrada/saída/ajuste)
- Exportar para CSV
- Stats em tempo real

**Vendas** (`/sales`)
- Seletor de cliente
- Adicionar produtos ao carrinho
- Gerenciar quantidades
- Aplicar desconto
- Finalizar venda
- Ver histórico de vendas

**Relatórios** (`/reports`)
- Gráficos de vendas por dia
- Distribuição de produtos vendidos
- Status de estoque visual
- Top clientes
- Tabela detalhada
- Exportar em CSV/PDF

---

## ⚙️ Configuração

### Variáveis de Ambiente (.env)

**Backend:**
```env
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=sua-chave-secreta-super-segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend:**
Nenhuma configuração necessária (usa `http://localhost:8000` por padrão)

### Personalização

**Cores Morena** (tailwind.config.js):
```javascript
'morena': {
  50: '#faf7f4',   // Mais claro
  900: '#5d3d2d',  // Mais escuro
}
```

**Duração de Notificações:**
```javascript
// Padrão: 3-5 segundos
notificationStore.addNotification(msg, type, 3000)
```

---

## 🐛 Solução de Problemas

### Backend

**Erro: `ModuleNotFoundError: No module named 'fastapi'`**
```bash
pip install -r requirements.txt
```

**Erro: `sqlite3.OperationalError: table X already exists`**
```bash
# Deletar arquivo banco:
rm test.db
# Reiniciar: python main.py
```

**Erro: `CORS errors`**
- Certificar que frotend está em `http://localhost:{porta}`
- Backend tem CORS habilitado para `*`

### Frontend

**Erro: `Failed to import Chart.js`**
```bash
cd frontend
npm install chart.js vue-chartjs
```

**Erro: `Cannot find module 'jsPDF'`**
```bash
npm install jspdf html2canvas
```

**Erro: `Token inválido / Logout automático`**
- Token expira após 30 minutos
- Faça login novamente

**Estilo Tailwind não funciona**
```bash
cd frontend
npm run build  # ou npm run dev
```

---

## 📈 Melhorias Futuras

1. **Dashboard Avançado**
   - Widgets customizáveis
   - Filtros por período
   - Alertas automáticos

2. **Autenticação**
   - OAuth 2.0 (Google, Microsoft)
   - 2FA (Two-factor authentication)
   - Refresh tokens automáticos

3. **Relatórios**
   - Relatórios agendados por email
   - Gráficos mais complexos (funnel, cohort)
   - Análise preditiva

4. **WebSocket**
   - Notificações reais (não polling)
   - Atualizações em tempo real
   - Chat de suporte

5. **Mobile**
   - App nativo React Native
   - Offline mode
   - Sincronização automática

6. **Integrações**
   - Integração com Stripe (pagamentos)
   - Sincronização com redes sociais
   - API pública para terceiros

---

## 📞 Suporte

Para suporte ou dúvidas:

1. Verifique a seção "Solução de Problemas"
2. Consulte os arquivos README específicos (README.md, CHANGELOG.md)
3. Revise os exemplos em `exemplos_uso.py`
4. Teste com dados de teste fornecidos

---

## 📄 Licença

Desenvolvido para **Morena Concept** - © 2026 - Todos os direitos reservados.

---

## ✅ Checklist de Features

- [x] Dashboard com 4 cards principais
- [x] Gestão de clientes (CRUD)
- [x] Catálogo de produtos com imagens
- [x] Duplicação de produtos
- [x] Gestão de estoque com movimentações
- [x] Sistema de vendas com carrinho
- [x] Relatórios com gráficos
- [x] Autenticação JWT
- [x] Tema claro/escuro
- [x] Exportação CSV/PDF
- [x] Notificações em tempo real
- [x] Documentação completa

---

**Versão:** 1.2.0  
**Última Atualização:** 2026  
**Status:** ✅ Production Ready
