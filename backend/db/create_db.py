import asyncio

from backend.db.core.database import db_engine, Base
from models.user import User
from models.storage import Storage
from models.package import Package
from models.stored_items import StoredItem


async def init_models():
    async with db_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(init_models())