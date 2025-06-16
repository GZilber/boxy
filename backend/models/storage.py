from pydantic import BaseModel


class StorageCreate(BaseModel):
    name: str
    location: str