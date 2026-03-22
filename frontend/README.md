# ERP Morena Concept - Frontend Vue

Interface moderna e responsiva para o sistema ERP.

## 🚀 Começar Rápido

### Instalação

```bash
cd frontend
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:5173**

### Build para Produção

```bash
npm run build
```

---

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── Navbar.vue     # Barra de navegação
│   │   ├── CustomerForm.vue # Formulário de clientes
│   │   ├── Alert.vue      # Componente de alerta
│   │   └── StatCard.vue   # Card de estatísticas
│   ├── views/             # Páginas principais
│   │   ├── Dashboard.vue  # Dashboard principal
│   │   ├── Customers.vue  # Gerenciar clientes
│   │   ├── Products.vue   # Catálogo de produtos
│   │   ├── Inventory.vue  # Controle de estoque
│   │   └── Sales.vue      # Gestão de vendas
│   ├── api/
│   │   └── client.js      # Cliente HTTP com Axios
│   ├── stores/            # Gerenciamento de estado (Pinia)
│   │   ├── customerStore.js
│   │   └── productStore.js
│   ├── App.vue            # Componente raiz
│   ├── main.js            # Entrada principal
│   ├── router.js          # Configuração de rotas
│   └── index.css          # Estilos globais
├── index.html             # HTML principal
├── package.json           # Dependências
├── vite.config.js         # Config Vite
├── tailwind.config.js     # Config Tailwind CSS
└── postcss.config.js      # Config PostCSS

```

---

## 🎨 Tecnologias Utilizadas

- **Vue 3** - Framework JavaScript moderno
- **Vite** - Build tool rápido
- **Tailwind CSS** - Framework CSS utilitário
- **Pinia** - Gerenciamento de estado
- **Vue Router** - Roteamento
- **Axios** - Cliente HTTP

---

## 🔌 Integração com API

O frontend se conecta automaticamente com o backend FastAPI:

- **Backend:** http://localhost:8000
- **Frontend:** http://localhost:5173

Proxy configurado em `vite.config.js`

---

## 📋 Funcionalidades Implementadas

✅ **Dashboard** - Visão geral do sistema
✅ **Gerenciar Clientes** - CRUD completo
🟡 **Catálogo de Produtos** - Em desenvolvimento
🟡 **Controle de Estoque** - Em desenvolvimento
🟡 **Gestão de Vendas** - Em desenvolvimento

---

## 🎯 Próximas Features

- [ ] Completar CRUD de produtos
- [ ] Implementar sistema de estoque
- [ ] Sistema de vendas com carrinho
- [ ] Relatórios e gráficos
- [ ] Autenticação JWT
- [ ] Temas dark/light
- [ ] Busca avançada
- [ ] Exportação de dados

---

## 🚀 Deploy

### Produção (Com Docker)

```bash
npm run build
# Servir com nginx ou outro servidor web
```

### Sem Docker

```bash
npm run build
# Usar um servidor web para servir pasta dist/
```

---

## 💡 Tips

- Use `npm run dev` para desenvolvimento
- Use `npm run build` para produção
- Altere cores em `tailwind.config.js`
- Adicione rotas em `src/router.js`
- Use Pinia para estado global

---

## 📞 Dados de Teste

Popule o banco com dados de teste:

```bash
cd .. && python seed_database.py
```

Depois acesse o frontend e veja os dados carregados!

---

## ⚙️ Configuração de Ambiente

Edite `vite.config.js` para:
- Mudar porta (padrão: 5173)
- Ajustar proxy da API
- Configurações de build

---

**Versão:** 1.1.1
**Status:** 🟢 Pronto para uso
**Última atualização:** Março 2026

