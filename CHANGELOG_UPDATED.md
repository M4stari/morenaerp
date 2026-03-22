# 🌺 ERP Morena Concept v1.2.0 - Changelog

Todas as mudanças notáveis neste projeto estão documentadas neste arquivo.

## [1.2.0] - 2026 (Production Ready)

### ✨ Novas Funcionalidades

#### 1. 📋 Página de Estoque Otimizada (Inventory)
- Tabela completa com status visual (cores)
- Filtro por status (Zerado, Baixo, OK)
- Formulário de movimentação (entrada/saída/ajuste)
- Estatísticas em tempo real
- Exportação para CSV com timestamp

#### 2. 🛒 Sistema de Vendas com Carrinho
- Seletor de cliente
- Adição de produtos com quantidade
- Carrinho lateral com preview
- Cálculo automático de subtotal/desconto/total
- Confirmação e novo registro de venda
- Histórico de vendas recentes

#### 3. 📊 Relatórios e Gráficos Avançados
- Gráfico de linha: Vendas por dia
- Gráfico de rosca: Distribuição de produtos
- Progresso visual de estoque
- Top 5 clientes por valor gasto
- Tabela detalhada de vendas
- Filtro por período

#### 4. 🔐 Autenticação JWT
- Login com email/senha
- Tokens JWT com expiração (30 min)
- Proteção de rotas
- Armazenamento seguro em localStorage
- Interceptor automático de requisições
- Logout com limpeza de dados
- Dois usuários de teste

#### 5. 🌙 Tema Claro/Escuro
- Toggle na navbar
- Persistência em localStorage
- Transição suave entre temas
- Cores otimizadas para cada tema
- Aplicado globalmente

#### 6. 📁 Exportação para CSV e PDF
- CSV com dados tabular
- PDF com tabelas formatadas
- Paginação automática em PDFs grandes
- Timestamps automáticos
- Download direto do navegador

#### 7. 🔔 Notificações em Tempo Real
- Toast notifications (popups)
- 4 tipos: success, error, warning, info
- Auto-desaparecimento
- Integração automática com API
- Animação suave

#### 8. 📝 Documentação Completa
- `README.md` - Instruções de instalação
- `FINAL_DOCUMENTATION.md` - Documentação de cada feature
- `CHANGELOG.md` - Este arquivo
- `QUICK_START.md` - Guia rápido
- Exemplos de código em Python e JavaScript

### 🔧 Alterações Técnicas

**Backend:**
- ✅ Novo arquivo: `routes_auth.py` (Autenticação JWT)
- ✅ Novo package: `PyJWT==2.8.1`
- ✅ Atualizado: `main.py` (incluir routes_auth)
- ✅ Endpoints: 7 novos endpoints de auth

**Frontend:**
- ✅ Nova página: `views/Login.vue`
- ✅ Novo componente: `components/NotificationCenter.vue`
- ✅ Novos stores: `authStore.js`, `themeStore.js`, `notificationStore.js`
- ✅ Atualizada: `router.js` (auth guard)
- ✅ Atualizada: `components/Navbar.vue` (user menu, theme toggle)
- ✅ Atualizada: `App.vue` (tema global)
- ✅ Atualizados: `tailwind.config.js` (darkMode), `package.json`
- ✅ Novo utilitário: `utils/exportUtils.js`
- ✅ Novas views: `Sales.vue`, `Reports.vue`
- ✅ Novas dependências: chart.js, vue-chartjs, jspdf, html2canvas

### 🐛 Correções

**v1.2.0:**
- ✅ Erro de CORS resolvido
- ✅ Notificações automáticas de sucesso/erro
- ✅ Token JWT expirado redireciona ao login
- ✅ Tema escuro funciona em todos os componentes
- ✅ Exportação PDF com tabelas formatadas
- ✅ Gráficos responsivos

### 📊 Estatísticas

| Métrica | v1.0.0 | v1.1.0 | v1.1.1 | v1.2.0 |
|---------|--------|--------|--------|--------|
| Endpoints | 24 | 34 | 34 | 41 |
| Componentes Vue | 4 | 4 | 4 | 8 |
| Views | - | 4 | 5 | 7 |
| Stores | - | 2 | 2 | 5 |
| Funções Auth | - | - | - | 4+ |
| Gráficos | - | - | - | 3+ |
| Temas | 1 | 1 | 1 | 2 |
| Linhas de Código | ~3000 | ~5000 | ~5500 | ~8500 |

---

## [1.1.1] - Anterior

### ✨ Adicionado
- Página de Estoque básica
- Componente Alert
- Exemplos de código
- Documentação de duplicação

### 🔧 Alterado
- Limite de produtos aumentado (10 → 100)
- Validação de preço relaxada (gt → ge)

### 🐛 Corrigido
- Erro PostCSS (CommonJS → ES Module)

---

## [1.1.0] - Anterior

### ✨ Adicionado
- Campo image_url em produtos
- Endpoints de edição via estoque
- Cálculos de lucro
- Frontend Vue 3 completo

---

## [1.0.0] - Inicial

### ✨ Adicionado
- Backend FastAPI com 4 módulos (clientes, produtos, estoque, vendas)
- Modelos SQLAlchemy
- Schemas Pydantic
- 24 endpoints REST
- Banco de dados SQLite

---

## 🎯 Roadmap Futuro

- [ ] Dashboard avançado com widgets
- [ ] OAuth 2.0 (Google, Microsoft)
- [ ] WebSocket para notificações reais
- [ ] Mobile app (React Native)
- [ ] Integração Stripe (pagamentos)
- [ ] Relatórios agendados por email
- [ ] Análise preditiva com ML

---

## 📝 Notas

**Breaking Changes:** Nenhum entre versões

**Dependências Atualizadas:**
- FastAPI: 0.104.1
- Vue: 3.3.7
- Tailwind: 3.3.6
- Chart.js: 4.4.0
- PyJWT: 2.8.1 (novo)

**Migration Guide:** Upgrade automático - sem ações necessárias

---

**Última Atualização:** 2026  
**Versão Atual:** 1.2.0  
**Status:** ✅ Production Ready
