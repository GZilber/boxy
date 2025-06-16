from uuid import UUID

from sqlalchemy import select, delete

from backend.db.models.storage import Storage
from backend.db.models.stored_items import StoredItem
from backend.db.models.user import User
from backend.models.storage import StorageCreate
from backend.services.base import BaseService


class StorageService(BaseService):
    async def create(self, storage: StorageCreate) -> Storage:
        """
        Creates a new Storage record.
        """
        db_storage = Storage(name=storage.name, location=storage.location)
        self.session.add(db_storage)
        await self.session.commit()
        await self.session.refresh(db_storage)  # Refresh to get auto-generated ID/UUID
        return db_storage

    async def get_by_uuid(self, uuid: UUID) -> Storage:
        """
        Retrieves a Storage Space by uuid.
        """
        stmt = select(Storage).where(Storage.uuid == uuid)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all(self) -> list[User]:
        """
        Retrieves all Storage spaces records.
        """
        stmt = select(User)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def delete(self, uuid: UUID) -> bool:
        """
        Deletes a Storage spaces record by UUID.
        """
        stmt = delete(Storage).where(Storage.uuid == uuid)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount == 1

    async def add_package(self, storage_space_uuid: UUID, package_uuid: UUID) -> bool:
        """
        Adds a package to a storage space.
        """
        db_stored_item = StoredItem(package_uuid=package_uuid, storage_space_uuid=storage_space_uuid)
        self.session.add(db_stored_item)
        await self.session.commit()
        await self.session.refresh(db_stored_item)
        return True