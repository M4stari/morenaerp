# Frontend React (TS + MUI) - Guia de Instalação e Desenvolvimento

Este guia orienta o setup de desenvolvimento local para a interface web refinada da Morena Concept.

## 🚀 Guia Rápido de Instalação

### 1. Pré-requisitos
- **Node.js** v18 ou superior instalado.
- Caso não possua, baixe e instale a versão LTS recomendada em [nodejs.org](https://nodejs.org/).

### 2. Baixar Dependências
Entre no diretório e instale os pacotes necessários:
```powershell
cd frontend
npm install
```

### 3. Configurar Endpoint do Servidor (.env)
Crie ou confirme a existência do arquivo `.env` na raiz do diretório `frontend/`:
```env
VITE_API_URL=http://localhost:8888
```

### 4. Executar Servidor Local
Inicie o servidor de desenvolvimento:
```powershell
npm run dev
```

Você deverá ver no console:
```
  VITE v5.0.5  ready in 250 ms

  ➜  Local:   http://localhost:5173/
```

Abra o navegador e acesse **`http://localhost:5173/`**.

---

## 🛠️ Comandos de Terminal Disponíveis

Na pasta `frontend/`:

```powershell
# Executar em modo de desenvolvimento (hot-reload)
npm run dev

# Checar tipos TypeScript e compilar bundle final para produção (pasta dist/)
npm run build

# Visualizar o build de produção localmente
npm run preview
```

---

## 💡 Primeiros Passos e Testes

Para garantir que o fluxo de ponta a ponta está operando:

1. **Inicie o Servidor do Backend**:
   Certifique-se de que o backend FastAPI está rodando na porta `8888`:
   ```powershell
   # Na pasta raiz do projeto
   python main.py
   ```
   Acesse a documentação interativa para testar as rotas em: [http://localhost:8888/docs](http://localhost:8888/docs).

2. **Popule a Base de Dados (Opcional)**:
   Caso queira ver registros de teste no dashboard, rode as seeds de clientes, estoque e faturamentos:
   ```powershell
   python seed_database.py
   python seed_estoque_completo.py
   ```

3. **Acesse a Interface**:
   Navegue até `http://localhost:5173/` e faça o login com as credenciais administrativas configuradas no backend (ex: `admin@morenaconcept.com` / `admin123`).

4. **Operações e Testes Recomendados**:
   - **Clientes**: Realize o cadastro de um novo CPF e busque na lista de clientes.
   - **Produtos**: Insira uma nova peça no acervo. Experimente usar a "Sugestão Inteligente" para preencher automaticamente o preço de venda calculando markup de 2,2x sobre o custo de compra.
   - **Estoque**: Localize o item cadastrado e utilize os botões `+` e `-` para realizar ajustes finos na contagem do produto, inserindo uma justificativa.
   - **Vendas**: Adicione uma venda com parcelas do carnê (de 1 a 24 parcelas), e experimente a baixa individual das parcelas (quitação parcial).
   - **Relatórios**: Verifique os gráficos dinâmicos de faturamento gerados por categoria e o botão para exportação direta em PDF.
