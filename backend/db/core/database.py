from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from backend import settings

db_engine = create_async_engine(settings.DATABASE_URL, echo=True, future=True)

session_maker = async_sessionmaker(bind=db_engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    db = session_maker()
    try:
        yield db
    finally:
        await db.close()
