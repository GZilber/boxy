from uuid import UUID

from sqlalchemy import select, delete

from backend.db.models.user import User
from backend.models.user import UserCreate
from backend.services.base import BaseService


class UserService(BaseService):
    async def create(self, user: UserCreate) -> User:
        """
        Creates a new User record.
        """
        db_user = User(
            email=user.email,
            password=user.password,
            full_name=user.full_name,
            role=user.role,
        )
        self.session.add(db_user)
        await self.session.commit()
        await self.session.refresh(db_user)  # Refresh to get auto-generated ID/UUID
        return db_user

    async def get_by_uuid(self, uuid: UUID) -> User:
        """
        Retrieves a User by their uuid.
        """
        stmt = select(User).where(User.uuid == uuid)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all(self) -> list[User]:
        """
        Retrieves all User records.
        """
        stmt = select(User)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def delete(self, uuid: UUID) -> bool:
        """
        Deletes a user record by their UUID.
        """
        stmt = delete(User).where(User.uuid == uuid)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount == 1