"""
Quick seed script to insert a few users so you can test /users, /users/match/{id}, /users/recommend/{id}

Run from project root:
    uvicorn server.main:app --reload   (in another terminal)
Then:
    python -m server.seed
"""

from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import User

""def upsert_user(db: Session, email: str, **kwargs):
    u = db.query(User).filter(User.email == email).first()
    if u:
        # update
        for k, v in kwargs.items():
            setattr(u, k, v)
    else:
        u = User(email=email, **kwargs)
        db.add(u)
    db.commit()
""""
def main():
    db = SessionLocal()
    try:
        upsert_user(
            db,
            email="alice@example.com",
            full_name="Alice Data",
            headline="NLP enthusiast",
            skills=["python", "pandas", "nlp"],
            interests=["recsys", "vector-search"],
            github_url="https://github.com/example/alice",
            colab_url=None,
        )
        upsert_user(
            db,
            email="bob@example.com",
            full_name="Bob Analyst",
            headline="Viz + BI",
            skills=["sql", "tableau", "viz"],
            interests=["python", "pandas", "ml"],
            github_url=None,
            colab_url=None,
        )
        upsert_user(
            db,
            email="carol@example.com",
            full_name="Carol ML",
            headline="Recsys tinkerer",
            skills=["ml", "recsys", "python"],
            interests=["nlp", "vector-search", "sql"],
            github_url="https://github.com/example/carol",
            colab_url=None,
        )
        print(" Seed complete.")
    finally:
        db.close()

"""""
if __name__ == "__main__":
    main()
