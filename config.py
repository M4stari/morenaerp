import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


def _normalize_database_url(url: str) -> str:
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg2://", 1)
    if url.startswith("postgresql://") and "+psycopg2" not in url:
        return url.replace("postgresql://", "postgresql+psycopg2://", 1)
    return url


class Settings:
    """Configuracoes da aplicacao."""

    def __init__(self):
        self.database_url = _normalize_database_url(
            os.getenv("DATABASE_URL", "sqlite:///./erp_moda.db")
        )
        self.app_name = os.getenv("APP_NAME", "ERP Morena Concept")
        self.debug = os.getenv("DEBUG", "False").lower() == "true"
        self.port = int(os.getenv("PORT", "8000"))
        cors_origins = os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173"
        )
        self.cors_origins = [
            origin.strip() for origin in cors_origins.split(",") if origin.strip()
        ]


@lru_cache()
def get_settings():
    """Carrega configuracoes uma unica vez."""
    return Settings()


settings = get_settings()
