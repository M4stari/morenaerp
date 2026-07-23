# ERP Morena Concept - Frontend React (TypeScript + MUI)

Interface moderna, escura e de alto padrão desenvolvida em **React, TypeScript e Material-UI (MUI)** para o ecossistema ERP da Morena Concept.

A identidade visual foi alinhada ao brandbook da marca, adotando a paleta de cores escuras e contrastantes da boutique (burgundy/pink, laranja aceso, preto e cinza soft).

---

## 🚀 Como Começar

### 1. Pré-requisitos
Certifique-se de ter o **Node.js** (versão 18 ou superior) instalado em sua máquina.
- Caso não tenha o Node instalado, faça o download em: [nodejs.org](https://nodejs.org/)

### 2. Instalação das Dependências
Entre na pasta do frontend e execute a instalação dos pacotes:
```bash
cd frontend
npm install
```

### 3. Configuração do Ambiente (.env)
Crie um arquivo `.env` na raiz do diretório `frontend/` (caso não tenha sido criado automaticamente) com a variável correspondente à URL da API do backend:
```env
VITE_API_URL=http://localhost:8888
```

### 4. Executando em Modo de Desenvolvimento
Inicie o servidor local do Vite:
```bash
npm run dev
```
O painel estará disponível em: **`http://localhost:5173`**

### 5. Compilação de Produção
Para verificar erros de tipo e compilar os arquivos estáticos para produção:
```bash
npm run build
```

---

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts          # Chamadas HTTP/Axios mapeadas às rotas do backend
│   ├── components/            # Componentes visuais compartilhados
│   │   ├── Navbar.tsx         # Menu lateral responsivo premium (Drawer + AppBar)
│   │   └── StatCard.tsx       # Cards métricos estatísticos
│   ├── context/               # Gerenciadores de estado globais
│   │   ├── AuthContext.tsx    # Contexto de controle de acesso e sessão de usuário
│   │   └── NotificationContext.tsx # Central de alertas instantâneos (Snackbar + Alert)
│   ├── views/                 # Telas e fluxos principais da boutique
│   │   ├── Login.tsx          # Login refinado com painel de marca
│   │   ├── Dashboard.tsx      # Métricas, ranking de vendas e peças pendentes
│   │   ├── Customers.tsx      # CRUD completo de clientes com busca e validações
│   │   ├── Products.tsx       # Catálogo de peças com sugestão inteligente de markup e duplicação
│   │   ├── Inventory.tsx      # Controle físico de estoque, custo médio e margens
│   │   ├── Sales.tsx          # Lançamentos de venda, parcelamentos e fluxo de quitação
│   │   └── Reports.tsx        # Relatórios de tendência comercial e exportação em PDF
│   ├── App.tsx                # Roteamento e wrappers de contexto
│   ├── main.tsx               # Entrada de renderização
│   ├── theme.ts               # Customização e tokens de design do Material-UI
│   ├── index.css              # Reset e gradientes de fundo ambientais
│   └── vite-env.d.ts          # Tipagem global das variáveis de ambiente
├── index.html                 # HTML principal carregando fontes e script entry
├── package.json               # Dependências do projeto
├── tsconfig.json              # Configurações gerais do TypeScript
└── vite.config.ts             # Configuração do Vite adaptado para React + TS
```

---

## 🎨 Design System e Cores da Boutique

O layout utiliza os tokens oficiais da Morena Concept:
- **Base (Fundo escuro principal)**: `#161314`
- **Paper (Cor dos cards e painéis)**: `#211d1f`
- **Primary Accent (Destaques e links)**: `#FF43A3` (brand-pink)
- **Secondary Energy (Alertas e parcelamentos)**: `#F58634` (brand-orange)
- **Texto Principal**: `#f4efef`

---

## 📋 Funcionalidades Migradas e Prontas
- [x] **Autenticação JWT** - Restrição automática de rotas com login sofisticado.
- [x] **Maison Dashboard** - Visão de tickets, margens médias de lucro e peças pendentes.
- [x] **Gestão de Clientes** - Filtros instantâneos por CPF e nome, cadastros e atualizações.
- [x] **Curadoria de Produtos** - Assistente de markup de venda (2,2x sobre o custo de compra), upload de imagens e ferramenta de duplicação automática de peças.
- [x] **Controle de Estoque** - Ajuste rápido de quantidade (entrada/saída) com log de motivos e exportação completa em CSV.
- [x] **Painel de Vendas** - Gerenciamento de itens múltiplos no carrinho, parcelamento em carnê de até 24 vezes, e baixa de parcelas individuais.
- [x] **Relatórios Avançados** - Gráficos de vendas acumuladas por produto e tendência de receita com download em formato PDF (via `html2canvas` + `jspdf`).
