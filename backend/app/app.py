from fastapi import FastAPI

from backend.app import user_routes, storage_routes, package_routes

app = FastAPI(
    title="Box Logistics API",
    description="API for box storage and delivery logistics system",
    version="1.0.0")

app.include_router(user_routes.router)
app.include_router(storage_routes.router)
app.include_router(package_routes.router)