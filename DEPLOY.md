# Deploy

## Estrutura recomendada

- Backend API: Render Web Service
- Banco de dados: Render PostgreSQL
- Frontend Vue/Vite: Vercel ou Render Static Site

## 1. Preparar repositorio

- Suba este projeto para um repositorio GitHub.
- Nao envie o arquivo `.env`.
- Use `.env.example` como referencia para as variaveis.

## 2. Backend no Render

### Criar banco PostgreSQL

- No Render, crie um `PostgreSQL`.
- Copie a `Internal Database URL` ou a `External Database URL`.

### Criar Web Service

- Conecte o repositorio GitHub.
- Selecione a raiz do projeto.
- O arquivo `render.yaml` ja sugere:
  - Build command: `pip install -r requirements.txt`
  - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Variaveis obrigatorias

- `DATABASE_URL`
- `SECRET_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SELLER_EMAIL`
- `SELLER_PASSWORD`
- `CORS_ORIGINS`
- `DEBUG=False`

### Exemplo de CORS

```env
CORS_ORIGINS=https://seu-frontend.vercel.app,https://seu-frontend.onrender.com
```

## 3. Frontend no Vercel

- Importe o repositorio no Vercel.
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Defina:

```env
VITE_API_URL=https://sua-api.onrender.com
```

- O arquivo `frontend/vercel.json` ja faz o rewrite da SPA para `index.html`.

## 4. Frontend no Render

Se preferir deixar tudo no Render:

- Crie um `Static Site`
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Variavel:

```env
VITE_API_URL=https://sua-api.onrender.com
```

## 5. Pos deploy

- Teste `https://sua-api.onrender.com/health`
- Teste `https://sua-api.onrender.com/docs`
- Entre no frontend e valide login, produtos, estoque e vendas

## 6. Observacao importante

Para producao, use PostgreSQL. O SQLite local `erp_moda.db` e bom para ambiente local, mas nao e a opcao indicada para hospedagem web.
