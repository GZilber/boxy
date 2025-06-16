from sqlalchemy.ext.asyncio import AsyncSession


class BaseService:
    """
    Base service class that provides common functionality for all services.
    """
    def __init__(self, session: AsyncSession):
        self.session = session
