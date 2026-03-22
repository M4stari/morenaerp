from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import init_db
from routes_auth import router as auth_router, verify_token
from routes_customers import router as customers_router
from routes_products import router as products_router
from routes_stocks import router as stocks_router
from routes_sales import router as sales_router

# Inicializa a aplicação FastAPI
app = FastAPI(
    title=settings.app_name,
    description="API ERP para gerenciamento de vendas de moda",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar banco de dados
init_db()

# Incluir rotas
app.include_router(auth_router)
app.include_router(customers_router, dependencies=[Depends(verify_token)])
app.include_router(products_router, dependencies=[Depends(verify_token)])
app.include_router(stocks_router, dependencies=[Depends(verify_token)])
app.include_router(sales_router, dependencies=[Depends(verify_token)])


@app.get("/")
def read_root():
    """Endpoint raiz para verificar se a API está rodando"""
    return {
        "message": "Bem-vindo ao ERP Morena Concept",
        "app_name": settings.app_name,
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
def health_check():
    """Endpoint para verificar a saúde da API"""
    return {
        "status": "healthy",
        "database": "connected"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=settings.port,
        reload=settings.debug
    )
