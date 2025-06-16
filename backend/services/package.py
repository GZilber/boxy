from uuid import UUID

from sqlalchemy import select, delete

from backend.db.models.package import Package
from backend.models.package import PackageCreate
from backend.services.base import BaseService


class PackageService(BaseService):
    async def create(self, package: PackageCreate) -> Package:
        """
        Creates a new Package record.
        """
        db_package = Package(**dict(package))
        self.session.add(db_package)
        await self.session.commit()
        await self.session.refresh(db_package)  # Refresh to get auto-generated ID/UUID
        return db_package

    async def get_by_uuid(self, uuid: UUID) -> Package:
        """
        Retrieves a Package by uuid.
        """
        stmt = select(Package).where(Package.uuid == uuid)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()


    async def delete(self, uuid: UUID) -> bool:
        """
        Deletes a Package record by UUID.
        """
        stmt = delete(Package).where(Package.uuid == uuid)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount == 1

    async def get_by_user_uuid(self, owner_uuid: UUID) -> list[Package]:
        """
        Retrieves all Packages associated with a specific user UUID.
        """
        stmt = select(Package).where(Package.owner_uuid == owner_uuid)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())