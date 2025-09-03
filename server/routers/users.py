from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserOut, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])

# ---------------------------
# Create user
# ---------------------------
@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    data = payload.model_dump(mode="json")

    if db.query(User).filter(User.email == data["email"]).first():
        raise HTTPException(400, "Email already registered.")

    user = User(**data)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/by_email", response_model=Optional[UserOut])
def get_user_by_email(email: str = Query(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    return user  # returns null if none


@router.get("/by_email", response_model=Optional[UserOut])
def get_user_by_email(email: str = Query(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    return user  # returns null if none

# ---------------------------
# List users
# ---------------------------
@router.get("/", response_model=List[UserOut])
def list_users(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(User).offset(skip).limit(limit).all()

# ---------------------------
# Get user by ID
# ---------------------------
@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user

# ---------------------------
# Update user
# ---------------------------
@router.patch("/{user_id}", response_model=UserOut)
def update_user(user_id: int, payload: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(404, "User not found.")

    updates = payload.model_dump(exclude_unset=True, mode="json")
    for k, v in updates.items():
        setattr(user, k, v)

    db.commit()
    db.refresh(user)
    return user

# ---------------------------
# Delete user
# ---------------------------
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    db.delete(user)
    db.commit()
    return

# ---------------------------
# Match users (skill <-> interest cross-over)
# ---------------------------
@router.get("/match/{user_id}", response_model=List[UserOut])
def match_users(user_id: int, db: Session = Depends(get_db)):
    current_user = db.query(User).get(user_id)
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found.")

    all_others = db.query(User).filter(User.id != user_id).all()

    def to_set(x):
        return set(x or [])

    cur_skills = to_set(current_user.skills)
    cur_interests = to_set(current_user.interests)

    matches = []
    for u in all_others:
        u_skills = to_set(u.skills)
        u_interests = to_set(u.interests)

        # match if my skills help their interests OR my interests match their skills
        if (cur_skills & u_interests) or (cur_interests & u_skills):
            matches.append(u)

    return matches

# ---------------------------
# Recommendations (score by overlap)
# ---------------------------
@router.get("/recommend/{user_id}", response_model=List[UserOut])
def recommend_users(user_id: int, db: Session = Depends(get_db)):
    current_user = db.query(User).get(user_id)
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found.")

    def to_set(x):
        return set(x or [])

    cur_skills = to_set(current_user.skills)
    cur_interests = to_set(current_user.interests)

    candidates = db.query(User).filter(User.id != user_id).all()

    def score(u: User) -> int:
        u_skills = to_set(u.skills)
        u_interests = to_set(u.interests)
        # +2 if cross matches, +1 if same-topic overlap
        cross = len(cur_skills & u_interests) + len(cur_interests & u_skills)
        common = len(cur_skills & u_skills) + len(cur_interests & u_interests)
        return 2 * cross + common

    ranked = sorted(candidates, key=score, reverse=True)
    return [u for u in ranked if score(u) > 0]
