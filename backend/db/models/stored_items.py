import uuid
from enum import Enum
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from backend.db.core.database import Base
from datetime import datetime, timezone

class StorageStatus(Enum):
    PROCESSED = "PROCESSED"
    IN_PROCESS = "IN_PROCESS"


class StoredItem(Base):
    __tablename__ = "stored_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    package_uuid: Mapped[UUID] = mapped_column(ForeignKey("packages.uuid"), unique=True)
    storage_space_uuid: Mapped[UUID] = mapped_column(ForeignKey("storage_spaces.uuid"), index=True)
    # status: Mapped[StorageStatus] = mapped_column(default=StorageStatus.PROCESSED, index=True) TODO: think about this
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now(timezone.utc),
                                                 onupdate=datetime.now(timezone.utc))
