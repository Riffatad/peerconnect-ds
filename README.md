# PeerConnect DS
Here’s a simplified and more traditional style README for your **PeerConnect DS** project:

---

# PeerConnect DS

PeerConnect DS is a **full-stack peer learning platform** that allows users to connect based on shared skills and learning goals. It includes user authentication, profile management, and a simple recommendation feature.

---

## Features

* **User Authentication** (Google Sign-In or Email/Password via Firebase)
* **Profile Management**: Create, update, and view profiles
* **Peer Matching**: See other users with overlapping skills and interests
* **Full CRUD Operations** for user data
* **Responsive UI** built with Tailwind CSS
* **REST API** powered by FastAPI and PostgreSQL (Supabase)

---

## Tech Stack

### **Frontend**

* React (CRA)
* React Router
* Tailwind CSS
* Firebase Authentication

### **Backend**

* FastAPI
* PostgreSQL (Supabase)
* SQLAlchemy ORM
* Pydantic

### **Machine Learning (Future Scope)**

* scikit-learn (placeholder for future matching algorithm)

---

## Project Structure

```
peerconnect-ds/
├── client/           # Frontend code
│   ├── src/
│   │   ├── pages/    # Login, Signup, Dashboard, Onboarding, Profile
│   │   ├── lib/      # firebase.js, api.js
│   │   └── context/  # AuthContext.jsx
│   └── public/
├── server/           # Backend code
│   ├── routers/      # users.py (API routes)
│   ├── database.py   # Database connection
│   ├── models.py     # SQLAlchemy models
│   ├── schemas.py    # Pydantic schemas
│   └── main.py       # FastAPI entry point
└── ml/               # Placeholder for ML models
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Riffatad/peerconnect-ds.git
cd peerconnect-ds
```

---

### 2. Backend Setup (FastAPI + PostgreSQL)

#### a) Create Virtual Environment

```bash
cd server
python -m venv venv
venv\Scripts\activate  # Windows
```

#### b) Install Dependencies

```bash
pip install fastapi uvicorn psycopg2-binary sqlalchemy pydantic[email] python-dotenv
```

#### c) Create `.env` File

Create a `server/.env` file with your PostgreSQL connection string:

```
DATABASE_URL=postgresql+psycopg2://username:password@hostname:5432/postgres
```

#### d) Run Backend

From project root:

```bash
uvicorn server.main:app --reload
```

**Backend runs at:** `http://127.0.0.1:8000`

Check API docs:
`http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup (React + Firebase)

#### a) Install Dependencies

```bash
cd client
npm install
```

#### b) Configure Firebase

Create `client/.env`:

```
REACT_APP_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_MESSAGING_SENDER_ID=your_messaging_id
REACT_APP_APP_ID=your_app_id
REACT_APP_API_BASE=http://127.0.0.1:8000
```

#### c) Run Frontend

```bash
npm start
```

**Frontend runs at:** `http://localhost:3000`

---

## Available API Endpoints

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| GET    | `/`                 | API health check    |
| POST   | `/users/`           | Create a user       |
| GET    | `/users/`           | List all users      |
| GET    | `/users/{id}`       | Get a single user   |
| PATCH  | `/users/{id}`       | Update user details |
| DELETE | `/users/{id}`       | Delete a user       |
| GET    | `/users/match/{id}` | Recommend peers     |

---

## Running Both Together

* **Backend**:
  Run in one terminal:

  ```bash
  uvicorn server.main:app --reload
  ```

* **Frontend**:
  Run in another terminal:

  ```bash
  cd client
  npm start
  ```

---

## Deployment (Future Scope)

* **Frontend** → Vercel or Netlify
* **Backend** → Render, Fly.io, or Supabase Edge Functions
* **Database** → Supabase (managed PostgreSQL)

---

## Troubleshooting

| Issue                      | Solution                                                      |
| -------------------------- | ------------------------------------------------------------- |
| CORS error                 | Check `CORSMiddleware` in `main.py`                           |
| "Failed to fetch" error    | Verify backend is running on `127.0.0.1:8000`                 |
| Firebase popup not working | Ensure correct Firebase keys in `.env`                        |
| React app not updating     | Clear cache: `rm -rf client/node_modules/.cache` then restart |

---

## Future Enhancements

* Machine learning-based matching
* Chat between users
* Notifications for matches
* Deploy live version for public use

