from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.modules.auth.router import router as auth_router, verify_token
from app.modules.customers.router import router as customers_router
from app.modules.products.router import router as products_router
from app.modules.stocks.router import router as stocks_router
from app.modules.sales.router import router as sales_router

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

# Incluir rotas
app.include_router(auth_router)
app.include_router(customers_router, dependencies=[Depends(verify_token)])
app.include_router(products_router, dependencies=[Depends(verify_token)])
app.include_router(stocks_router, dependencies=[Depends(verify_token)])
app.include_router(sales_router, dependencies=[Depends(verify_token)])


@app.on_event("startup")
def startup_event():
    """Garante estrutura minima do banco ao iniciar a API."""
    init_db()


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
