from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routes.health import router as health_router
from app.routes.tasks import router as tasks_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager that initializes the database on startup."""
    init_db()
    yield


app = FastAPI(
    title="Task Manager API",
    description="A clean, beginner-friendly REST API for managing tasks.",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS so the React Vite frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(health_router)
app.include_router(tasks_router)


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to the Task Manager API",
        "docs": "/docs",
        "health": "/health",
    }
