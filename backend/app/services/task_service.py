from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import Task
from app.schemas import TaskCreate, TaskUpdate, TaskStatus, DashboardStats


class TaskService:
    @staticmethod
    def get_all(
        db: Session,
        status: Optional[TaskStatus] = None,
        search: Optional[str] = None
    ) -> List[Task]:
        """Retrieve tasks, with optional status filtering and title search."""
        query = db.query(Task)
        if status:
            query = query.filter(Task.status == status.value)
        if search:
            search_clean = search.strip()
            if search_clean:
                query = query.filter(Task.title.ilike(f"%{search_clean}%"))
        return query.order_by(Task.id.desc()).all()

    @staticmethod
    def get_by_id(db: Session, task_id: int) -> Optional[Task]:
        """Retrieve a single task by ID."""
        return db.query(Task).filter(Task.id == task_id).first()

    @staticmethod
    def create(db: Session, task_data: TaskCreate) -> Task:
        """Create a new task in the database."""
        status_value = task_data.status.value if task_data.status else TaskStatus.PENDING.value
        task = Task(
            title=task_data.title.strip(),
            description=(task_data.description or "").strip(),
            status=status_value,
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def update(db: Session, task_id: int, task_data: TaskUpdate) -> Optional[Task]:
        """Update an existing task's title, description, or status."""
        task = TaskService.get_by_id(db, task_id)
        if not task:
            return None

        if task_data.title is not None:
            task.title = task_data.title.strip()
        if task_data.description is not None:
            task.description = task_data.description.strip()
        if task_data.status is not None:
            task.status = task_data.status.value

        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def update_status(db: Session, task_id: int, new_status: TaskStatus) -> Optional[Task]:
        """Update only the status of an existing task."""
        task = TaskService.get_by_id(db, task_id)
        if not task:
            return None

        task.status = new_status.value
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def delete(db: Session, task_id: int) -> bool:
        """Delete a task by ID. Returns True if deleted, False if not found."""
        task = TaskService.get_by_id(db, task_id)
        if not task:
            return False

        db.delete(task)
        db.commit()
        return True

    @staticmethod
    def get_dashboard_stats(db: Session) -> DashboardStats:
        """Calculate aggregate counts for the dashboard."""
        total = db.query(Task).count()
        pending = db.query(Task).filter(Task.status == TaskStatus.PENDING.value).count()
        in_progress = db.query(Task).filter(Task.status == TaskStatus.IN_PROGRESS.value).count()
        completed = db.query(Task).filter(Task.status == TaskStatus.COMPLETED.value).count()

        return DashboardStats(
            total=total,
            pending=pending,
            in_progress=in_progress,
            completed=completed,
        )
