from uuid import UUID

from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from backend.db.core.database import get_db
from backend.models.storage import StorageCreate
from backend.services.storage import StorageService

router = APIRouter(prefix="/storage", tags=["storage"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_storage(storage: StorageCreate, db: AsyncSession = Depends(get_db)):
    ss = StorageService(db)
    storage = await ss.create(storage)
    return {
        "message": "Storage space created successfully",
        "storage": storage
    }


@router.put("/{storage_uuid}/package/{package_uuid}", status_code=status.HTTP_201_CREATED)
async def add_package_to_storage(storage_uuid: UUID, package_uuid: UUID, db: AsyncSession = Depends(get_db)):
    ss = StorageService(db)
    updated_storage = await ss.add_package(storage_uuid, package_uuid)

    if not updated_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Error"
        )
    return {"message": "Package added to storage space successfully"}


@router.delete("/{storage_uuid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_storage(storage_uuid: UUID, db: AsyncSession = Depends(get_db)):
    ss = StorageService(db)
    deleted = await ss.delete(storage_uuid)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Storage space with UUID '{storage_uuid}' not found."
        )
    # Return a 204 No Content status for successful deletion
    return


@router.get("/{storage_uuid}", status_code=status.HTTP_200_OK)
async def get_storage(storage_uuid: UUID, db: AsyncSession = Depends(get_db)):
    ss = StorageService(db)
    storage = await ss.get_by_uuid(storage_uuid)

    if not storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Storage space with UUID '{storage_uuid}' not found."
        )
    return dict(storage=storage)
