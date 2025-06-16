import uuid
from uuid import UUID

from sqlalchemy import DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from backend.db.core.database import Base
from datetime import datetime, timezone

from backend.models.user import UserRole


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    uuid: Mapped[UUID] = mapped_column(unique=True, default=uuid.uuid4, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    password: Mapped[str]
    full_name: Mapped[str]
    role: Mapped[UserRole]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                                                 onupdate=lambda: datetime.now(timezone.utc))

    # boxes = relationship("Box", back_populates="owner")
    # scans = relationship("Scan", back_populates="user")
