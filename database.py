from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

from config import settings

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {},
    echo=settings.debug
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency para injetar a sessao do banco em cada requisicao."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _ensure_sales_columns():
    inspector = inspect(engine)
    if "sales" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("sales")}
    statements = []
    datetime_type = "TIMESTAMP" if engine.dialect.name == "postgresql" else "DATETIME"

    if "due_date" not in existing_columns:
        statements.append(f"ALTER TABLE sales ADD COLUMN due_date {datetime_type}")
    if "paid_at" not in existing_columns:
        statements.append(f"ALTER TABLE sales ADD COLUMN paid_at {datetime_type}")
    if "payment_notes" not in existing_columns:
        statements.append("ALTER TABLE sales ADD COLUMN payment_notes TEXT")

    if not statements:
        return

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))


def init_db():
    """Inicializa o banco de dados criando tabelas e colunas novas."""
    Base.metadata.create_all(bind=engine)
    _ensure_sales_columns()
