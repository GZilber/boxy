import asyncio
from app.core.database import engine
from app.models.user import User
from app.models.box import Box
from app.models.partner import Partner
from app.models.courier import Courier
from app.models.scan import Scan
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import random

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession
)

async def create_test_data():
    async with SessionLocal() as db:
        # Create test users
        users = [
            User(
                email="user1@example.com",
                password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # password: test
                full_name="Test User 1",
                role="USER"
            ),
            User(
                email="user2@example.com",
                password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
                full_name="Test User 2",
                role="USER"
            ),
            User(
                email="courier1@example.com",
                password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
                full_name="Courier 1",
                role="COURIER"
            ),
            User(
                email="partner1@example.com",
                password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
                full_name="Partner 1",
                role="PARTNER"
            ),
            User(
                email="admin@example.com",
                password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
                full_name="Admin User",
                role="ADMIN"
            )
        ]
        db.add_all(users)
        await db.flush()

        # Create partner locations
        partners = [
            Partner(
                name="Partner Location 1",
                address="123 Main St, Tel Aviv",
                contact_email="partner1@example.com",
                user_id=users[3].id
            ),
            Partner(
                name="Partner Location 2",
                address="456 Market St, Tel Aviv",
                contact_email="partner2@example.com",
                user_id=users[3].id
            )
        ]
        db.add_all(partners)
        await db.flush()

        # Create test boxes
        box_sizes = ["SMALL", "MEDIUM", "LARGE", "EXTRA_LARGE"]
        box_statuses = ["AT_HOME", "IN_STORAGE", "IN_TRANSIT", "DELIVERED"]
        
        boxes = []
        for i in range(10):
            box = Box(
                box_id=f"BOX-{i+1:04d}",
                size=random.choice(box_sizes),
                status=random.choice(box_statuses),
                owner_id=users[0].id,
                current_location_id=random.choice(partners).id if random.random() > 0.5 else None,
                current_courier_id=users[2].id if random.random() > 0.5 else None
            )
            boxes.append(box)
        db.add_all(boxes)
        await db.flush()

        # Create test scans
        scans = []
        for box in boxes:
            if box.status != "AT_HOME":
                scan = Scan(
                    box_id=box.id,
                    user_id=random.choice(users).id,
                    action="SCAN",
                    location_id=random.choice(partners).id if random.random() > 0.5 else None,
                    timestamp=datetime.utcnow() - timedelta(days=random.randint(0, 30))
                )
                scans.append(scan)
        db.add_all(scans)

        await db.commit()

if __name__ == "__main__":
    asyncio.run(create_test_data())
