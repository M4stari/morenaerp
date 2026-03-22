from datetime import datetime, timedelta
import os

import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from pydantic import BaseModel

load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])


def _require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Variavel de ambiente obrigatoria ausente: {name}")
    return value


SECRET_KEY = _require_env("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str


def _build_users():
    users = {}

    admin_email = _require_env("ADMIN_EMAIL")
    users[admin_email] = {
        "id": 1,
        "name": os.getenv("ADMIN_NAME", "Administrador"),
        "email": admin_email,
        "password": _require_env("ADMIN_PASSWORD"),
        "role": "admin",
    }

    seller_email = os.getenv("SELLER_EMAIL")
    seller_password = os.getenv("SELLER_PASSWORD")
    if seller_email and seller_password:
        users[seller_email] = {
            "id": 2,
            "name": os.getenv("SELLER_NAME", "Vendedor"),
            "email": seller_email,
            "password": seller_password,
            "role": "vendedor",
        }

    return users


USERS = _build_users()


def create_access_token(data: dict):
    """Cria um JWT token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(credentials=Depends(security)):
    """Verifica um JWT token."""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalido",
            )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalido",
        )
    return email


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Realiza login do usuario."""
    user = USERS.get(request.email)

    if not user or user["password"] != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
        )

    access_token = create_access_token(
        data={"email": user["email"], "id": user["id"], "role": user["role"]}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
        },
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user(email: str = Depends(verify_token)):
    """Retorna informacoes do usuario autenticado."""
    user = USERS.get(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario nao encontrado",
        )
    return UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        role=user["role"],
    )


@router.post("/logout")
async def logout(email: str = Depends(verify_token)):
    """Realiza logout."""
    return {"message": f"Logout realizado com sucesso para {email}"}


@router.post("/refresh")
async def refresh_token(email: str = Depends(verify_token)):
    """Renova o token de acesso."""
    user = USERS.get(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario nao encontrado",
        )

    access_token = create_access_token(
        data={"email": user["email"], "id": user["id"], "role": user["role"]}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
