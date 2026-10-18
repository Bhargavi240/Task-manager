from fastapi import APIRouter
from app.schemas import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse, summary="Check backend health status")
def check_health():
    """Health check endpoint to verify that the backend API is up and running."""
    return HealthResponse(
        status="ok",
        message="Task Manager API is healthy and operational."
    )
