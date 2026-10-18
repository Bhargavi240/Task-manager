from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import (
    TaskCreate,
    TaskUpdate,
    TaskStatusUpdate,
    TaskResponse,
    TaskStatus,
    DashboardStats,
    MessageResponse,
)
from app.services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("", response_model=List[TaskResponse], summary="Retrieve all tasks")
@router.get("/", response_model=List[TaskResponse], include_in_schema=False)
def get_tasks(
    status: Optional[TaskStatus] = Query(None, description="Filter tasks by status"),
    search: Optional[str] = Query(None, description="Search tasks by title keyword"),
    db: Session = Depends(get_db),
):
    """Retrieve all tasks with optional status filter and title search."""
    return TaskService.get_all(db, status=status, search=search)


@router.get("/stats/summary", response_model=DashboardStats, summary="Get dashboard task counts")
def get_task_stats(db: Session = Depends(get_db)):
    """Retrieve aggregate counts for dashboard: total, pending, in-progress, completed."""
    return TaskService.get_dashboard_stats(db)


@router.get("/{task_id}", response_model=TaskResponse, summary="Retrieve a single task")
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Retrieve a single task by its unique ID."""
    task = TaskService.get_by_id(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found",
        )
    return task


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED, summary="Create a new task")
@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_task(task_in: TaskCreate, db: Session = Depends(get_db)):
    """Create a new task with title, optional description, and optional status."""
    return TaskService.create(db, task_in)


@router.put("/{task_id}", response_model=TaskResponse, summary="Update an existing task")
def update_task(task_id: int, task_in: TaskUpdate, db: Session = Depends(get_db)):
    """Update title, description, or status of an existing task."""
    updated_task = TaskService.update(db, task_id, task_in)
    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found",
        )
    return updated_task


@router.patch("/{task_id}/status", response_model=TaskResponse, summary="Update task status")
def update_task_status(
    task_id: int,
    status_in: TaskStatusUpdate,
    db: Session = Depends(get_db),
):
    """Update only the status of an existing task."""
    updated_task = TaskService.update_status(db, task_id, status_in.status)
    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found",
        )
    return updated_task


@router.delete("/{task_id}", response_model=MessageResponse, summary="Delete a task")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Delete a task by ID."""
    deleted = TaskService.delete(db, task_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found",
        )
    return MessageResponse(message=f"Task {task_id} deleted successfully.")
