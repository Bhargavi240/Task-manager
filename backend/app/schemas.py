from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, field_validator, ConfigDict


class TaskStatus(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Title of the task")
    description: Optional[str] = Field(default="", description="Detailed description of the task")

    @field_validator("title")
    @classmethod
    def validate_title_not_empty(cls, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("Task title cannot be empty or only whitespace")
        return trimmed


class TaskCreate(TaskBase):
    status: Optional[TaskStatus] = Field(default=TaskStatus.PENDING, description="Initial task status")


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=200, description="Updated task title")
    description: Optional[str] = Field(default=None, description="Updated task description")
    status: Optional[TaskStatus] = Field(default=None, description="Updated task status")

    @field_validator("title")
    @classmethod
    def validate_optional_title(cls, value: Optional[str]) -> Optional[str]:
        if value is not None:
            trimmed = value.strip()
            if not trimmed:
                raise ValueError("Task title cannot be empty or only whitespace")
            return trimmed
        return value


class TaskStatusUpdate(BaseModel):
    status: TaskStatus = Field(..., description="New status for the task")


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = ""
    status: TaskStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DashboardStats(BaseModel):
    total: int
    pending: int
    in_progress: int
    completed: int


class HealthResponse(BaseModel):
    status: str
    message: str


class MessageResponse(BaseModel):
    message: str
