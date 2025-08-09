from pydantic import BaseModel, EmailStr, HttpUrl, Field
from typing import List, Optional

class UserBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    headline: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    github_url: Optional[HttpUrl] = None
    colab_url: Optional[HttpUrl] = None

class UserCreate(UserBase): pass

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    headline: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    github_url: Optional[HttpUrl] = None
    colab_url: Optional[HttpUrl] = None

class UserOut(UserBase):
    id: int
    class Config:
        from_attributes = True
