from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class PackageStatus(Enum):
    AT_HOME = "AT_HOME"
    REQUESTED = "REQUESTED"
    IN_TRANSIT = "IN_TRANSIT"
    IN_STORAGE = "IN_STORAGE"
    DELIVERED = "DELIVERED"


class PackageCreate(BaseModel):
    owner_uuid: UUID
    package_description: str
    package_weight: float
    package_dimensions: str
    status: PackageStatus
