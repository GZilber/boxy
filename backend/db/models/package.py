import uuid
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from backend.db.core.database import Base
from datetime import datetime, timezone

from backend.models.package import PackageStatus


class Package(Base):
    __tablename__ = "packages"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    uuid: Mapped[UUID] = mapped_column(unique=True, default=uuid.uuid4, index=True)
    owner_uuid: Mapped[UUID] = mapped_column(ForeignKey("users.uuid"), index=True)
    package_description: Mapped[str]
    package_weight: Mapped[float]
    package_dimensions: Mapped[str]  # e.g., "10x20x30 cm"
    status: Mapped[PackageStatus] = mapped_column(default=PackageStatus.AT_HOME)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now(timezone.utc),
                                                 onupdate=datetime.now(timezone.utc))
