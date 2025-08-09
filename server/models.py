from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    headline = Column(String(255), nullable=True)
    skills = Column(JSONB, nullable=True)      # list[str]
    interests = Column(JSONB, nullable=True)   # list[str]
    github_url = Column(String(255), nullable=True)
    colab_url = Column(String(255), nullable=True)
