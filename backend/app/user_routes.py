from uuid import UUID

from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from backend.db.core.database import get_db
from backend.models.user import UserCreate
from backend.services.user import UserService

router = APIRouter(prefix="/user", tags=["users"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    us = UserService(db)
    user = await us.create(user)
    return {
        "message": "User created successfully",
        "user": user
    }


@router.delete("/{user_uuid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_uuid: UUID, db: AsyncSession = Depends(get_db)):
    us = UserService(db)
    deleted = await us.delete(user_uuid)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with UUID '{user_uuid}' not found."
        )
    # Return a 204 No Content status for successful deletion
    return


@router.get("/{user_uuid}", status_code=status.HTTP_200_OK)
async def get_user(user_uuid: UUID, db: AsyncSession = Depends(get_db)):
    us = UserService(db)
    user = await us.get_by_uuid(user_uuid)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with UUID '{user_uuid}' not found."
        )
    return dict(user=user)
