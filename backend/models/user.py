from enum import Enum

from pydantic import BaseModel


class UserRole(Enum):
    USER = "USER"
    COURIER = "COURIER"
    PARTNER = "PARTNER"
    ADMIN = "ADMIN"


class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: UserRole