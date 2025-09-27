from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, status
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
import os, logging, uuid, bcrypt, jwt, aiofiles
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from bson import ObjectId
from mangum import Mangum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

client = None
db = None

JWT_SECRET = os.environ.get("JWT_SECRET", "your-secret-key-change-this")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db

    print("Connecting to MongoDB...")
    mongo_url = os.environ.get("MONGO_URL")
    db_name = os.environ.get("DB_NAME")

    if not mongo_url or not db_name:
        raise RuntimeError("MONGO_URL or DB_NAME not set")

    try:
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        print("Connected to MongoDB successfully!")

        # Initialize sample data
        print("Initializing sample quizzes...")
        sample_quizzes = [
            {"id": str(uuid.uuid4()), "title": "Anxiety Assessment", "description": "Evaluate your anxiety levels",
             "category": "anxiety", "created_by": "system",
             "questions": [{"question": "How often do you feel nervous or anxious?",
                            "options": ["Never", "Sometimes", "Often", "Always"],
                            "type": "multiple_choice"}],
             "created_at": datetime.now(timezone.utc)}
        ]
        for quiz in sample_quizzes:
            existing = await db.quizzes.find_one({"title": quiz["title"]})
            if not existing:
                await db.quizzes.insert_one(quiz)
                print(f"Inserted sample quiz: {quiz['title']}")

    except Exception as e:
        logging.error(f"Error connecting to MongoDB: {e}")
        raise

    yield

    print("Closing MongoDB connection...")
    if client:
        client.close()

app = FastAPI(title="MindMate - Student Mental Health Platform", lifespan=lifespan)

api_router = APIRouter(prefix="/api")

@app.get("/")
async def root():
    return {"message": "MindMate backend is running on Vercel!"}

# 👉 all your routes go here...
app.include_router(api_router)

# Static files (⚠️ ephemeral on Vercel)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# CORS
cors_origins = os.environ.get("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Required for Vercel
handler = Mangum(app)
