from uuid import UUID
import uuid
from sqlalchemy.orm import mapped_column, Mapped

from backend.db.core.database import Base


class Storage(Base):
    __tablename__ = "storage_spaces"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    uuid: Mapped[UUID] = mapped_column(unique=True, default=uuid.uuid4, index=True)
    name: Mapped[str]
    location: Mapped[str]
