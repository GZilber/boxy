from uuid import UUID

from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from backend.db.core.database import get_db
from backend.models.package import PackageCreate
from backend.services.package import PackageService

router = APIRouter(prefix="/package", tags=["package"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_package(package: PackageCreate, db: AsyncSession = Depends(get_db)):
    ps = PackageService(db)
    package = await ps.create(package)
    return {
        "message": "Package created successfully",
        "package": package
    }


@router.delete("/{package_uuid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_package(package_uuid: UUID, db: AsyncSession = Depends(get_db)):
    ps = PackageService(db)
    deleted = await ps.delete(package_uuid)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Package with UUID '{package_uuid}' not found."
        )
    # Return a 204 No Content status for successful deletion
    return


@router.get("/{package_uuid}", status_code=status.HTTP_200_OK)
async def get_package(package_uuid: UUID, db: AsyncSession = Depends(get_db)):
    ps = PackageService(db)
    package = await ps.get_by_uuid(package_uuid)

    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Package with UUID '{package_uuid}' not found."
        )
    return dict(package=package)

@router.get("/user/{user_uuid}", status_code=status.HTTP_200_OK)
async def get_user_packages(user_uuid: UUID, db: AsyncSession = Depends(get_db)):
    ps = PackageService(db)
    packages = await ps.get_by_user_uuid(user_uuid)

    if not packages:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No packages found for user with UUID '{user_uuid}'."
        )
    return dict(packages=packages)