# Frontend Vue - Guia de Instalação

## Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn

## Instalação Passo a Passo

### 1. Navegue até a pasta frontend

```powershell
cd frontend
```

### 2. Instale as dependências

```powershell
npm install
```

Isso vai baixar e instalar:
- Vue 3
- Vite
- Tailwind CSS
- Pinia (state management)
- Axios (HTTP client)
- E outras dependências

**Tempo estimado:** 2-5 minutos

### 3. Inicie o servidor de desenvolvimento

```powershell
npm run dev
```

Você verá algo como:
```
VITE v5.0.5  ready in 245 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### 4. Abra no navegador

Na barra de endereço do navegador, acesse:

```
http://localhost:5173
```

Pronto! O frontend está rodando! 🎉

## Estrutura de Arquivos

```
frontend/
├── src/
│   ├── components/     # Componentes Vue reutilizáveis
│   ├── views/          # Páginas principais
│   ├── api/            # Integração com backend
│   ├── stores/         # State management (Pinia)
│   ├── App.vue         # Componente raiz
│   └── main.js         # Arquivo de entrada
├── index.html          # HTML principal
├── package.json        # Dependências do projeto
├── vite.config.js      # Configuração Vite
└── README.md           # Este arquivo
```

## Comandos Disponíveis

```powershell
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Visualizar build de produção
npm run preview

# Lint de código
npm run lint
```

## Conexão com Backend

O frontend já está configurado para se conectar com o backend FastAPI:

- **Backend rodando em:** http://localhost:8000
- **Frontend rodando em:** http://localhost:5173

Proxy configurado automaticamente em `vite.config.js`

## Primeiro Teste

1. Certifique-se de que o **backend está rodando:**
   ```powershell
   # Em outro PowerShell, na pasta raiz
   python main.py
   ```

2. **Popule dados de teste** (opcional):
   ```powershell
   python seed_database.py
   ```

3. **Abra o frontend** em http://localhost:5173

4. **Teste a seção de Clientes** - Você deve conseguir:
   - Ver a lista de clientes cadastrados
   - Adicionar novo cliente
   - Deletar cliente

## Troubleshooting

**Erro: "Port 5173 already in use"**
```powershell
# Mude a porta em vite.config.js ou finalize o processo anterior
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Erro: "Cannot find module"**
```powershell
# Reinstale as dependências
rimraf node_modules package-lock.json
npm install
```

**Erro: "API not responding"**
```powershell
# Certifique-se que o backend está rodando
python main.py
```

## Desenvolvimento

### Adicionar Nova Página

1. Crie arquivo em `src/views/MinhaView.vue`
2. Importe em `src/router.js`
3. Adicione rota:
   ```javascript
   {
     path: '/minha-pagina',
     component: MinhaView
   }
   ```

### Adicionar Novo Componente

1. Crie arquivo em `src/components/MeuComponente.vue`
2. Use em outra page/componente:
   ```vue
   <template>
     <MeuComponente />
   </template>
   
   <script setup>
   import MeuComponente from '../components/MeuComponente.vue'
   </script>
   ```

### Estilo com Tailwind CSS

Use classes Tailwind diretamente nos templates:

```vue
<button class="bg-morena-600 text-white px-4 py-2 rounded-lg hover:bg-morena-700">
  Clique aqui
</button>
```

## Build para Produção

```powershell
npm run build
```

Isso gera uma pasta `dist/` com os arquivos otimizados para produção.

**Servir em produção:**
- Use Nginx, Apache ou outro servidor web
- Apontar para pasta `dist/`
- Configurar CORS se necessário

## Cores Customizadas

Cores "Morena Concept" definidas em `tailwind.config.js`:

- `morena-600`: Principal
- `morena-700`: Hover/Ativo
- `morena-900`: Escuro

Use nas classes TW: `bg-morena-600`, `text-morena-900`, etc.

---

✨ **Frontend Vue da Morena Concept pronto para uso!**

