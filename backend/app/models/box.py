from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime
from enum import Enum as PyEnum

class BoxStatus(str, PyEnum):
    AT_HOME = "AT_HOME"
    REQUESTED = "REQUESTED"
    IN_TRANSIT = "IN_TRANSIT"
    IN_STORAGE = "IN_STORAGE"
    DELIVERED = "DELIVERED"

class BoxSize(str, PyEnum):
    SMALL = "SMALL"
    MEDIUM = "MEDIUM"
    LARGE = "LARGE"
    EXTRA_LARGE = "EXTRA_LARGE"

class Box(Base):
    __tablename__ = "boxes"

    id = Column(Integer, primary_key=True, index=True)
    box_id = Column(String, unique=True, index=True)
    size = Column(Enum(BoxSize))
    status = Column(Enum(BoxStatus))
    owner_id = Column(Integer, ForeignKey("users.id"))
    current_location_id = Column(Integer, ForeignKey("partners.id"), nullable=True)
    current_courier_id = Column(Integer, ForeignKey("couriers.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="boxes")
    current_location = relationship("Partner", back_populates="boxes")
    current_courier = relationship("Courier", back_populates="boxes")
    scans = relationship("Scan", back_populates="box", cascade="all, delete-orphan")
