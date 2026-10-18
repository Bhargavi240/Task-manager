import pytest
from pydantic import ValidationError
from app.schemas import TaskCreate, TaskUpdate, TaskStatus, TaskStatusUpdate
from app.services.task_service import TaskService


def test_task_creation_and_defaults(db_session):
    """Test creating a task with defaults (status defaults to Pending)."""
    task_in = TaskCreate(title="Buy Groceries", description="Milk, Eggs, Bread")
    created = TaskService.create(db_session, task_in)

    assert created.id is not None
    assert created.title == "Buy Groceries"
    assert created.description == "Milk, Eggs, Bread"
    assert created.status == TaskStatus.PENDING.value
    assert created.created_at is not None
    assert created.updated_at is not None


def test_task_creation_with_specific_status(db_session):
    """Test creating a task with an explicit status."""
    task_in = TaskCreate(
        title="Deploy app",
        description="Run production build",
        status=TaskStatus.IN_PROGRESS,
    )
    created = TaskService.create(db_session, task_in)

    assert created.title == "Deploy app"
    assert created.status == TaskStatus.IN_PROGRESS.value


def test_task_validation_empty_or_whitespace_title():
    """Test that empty or whitespace-only titles fail Pydantic validation."""
    with pytest.raises(ValidationError):
        TaskCreate(title="")

    with pytest.raises(ValidationError):
        TaskCreate(title="   ")

    with pytest.raises(ValidationError):
        TaskUpdate(title="   ")


def test_task_status_validation():
    """Test valid and invalid task statuses."""
    # Valid statuses
    assert TaskStatus("Pending") == TaskStatus.PENDING
    assert TaskStatus("In Progress") == TaskStatus.IN_PROGRESS
    assert TaskStatus("Completed") == TaskStatus.COMPLETED

    # Invalid status raises ValueError
    with pytest.raises(ValueError):
        TaskStatus("Archived")

    with pytest.raises(ValidationError):
        TaskStatusUpdate(status="NotValidStatus")


def test_task_update_logic(db_session):
    """Test updating task title, description, and status."""
    task = TaskService.create(
        db_session,
        TaskCreate(title="Original Title", description="Original Desc"),
    )

    update_in = TaskUpdate(
        title="Updated Title",
        description="Updated Desc",
        status=TaskStatus.COMPLETED,
    )
    updated = TaskService.update(db_session, task.id, update_in)

    assert updated is not None
    assert updated.id == task.id
    assert updated.title == "Updated Title"
    assert updated.description == "Updated Desc"
    assert updated.status == TaskStatus.COMPLETED.value


def test_task_partial_update_logic(db_session):
    """Test partial update leaves omitted fields unchanged."""
    task = TaskService.create(
        db_session,
        TaskCreate(title="Initial Title", description="Initial Desc"),
    )

    # Update only title
    updated = TaskService.update(db_session, task.id, TaskUpdate(title="Only Title Changed"))
    assert updated.title == "Only Title Changed"
    assert updated.description == "Initial Desc"
    assert updated.status == TaskStatus.PENDING.value


def test_task_update_status_only(db_session):
    """Test updating status specifically."""
    task = TaskService.create(db_session, TaskCreate(title="Status test"))
    assert task.status == TaskStatus.PENDING.value

    updated = TaskService.update_status(db_session, task.id, TaskStatus.IN_PROGRESS)
    assert updated is not None
    assert updated.status == TaskStatus.IN_PROGRESS.value

    updated2 = TaskService.update_status(db_session, task.id, TaskStatus.COMPLETED)
    assert updated2 is not None
    assert updated2.status == TaskStatus.COMPLETED.value


def test_task_deletion_logic(db_session):
    """Test deleting an existing task removes it from database."""
    task = TaskService.create(db_session, TaskCreate(title="To be deleted"))
    task_id = task.id

    assert TaskService.get_by_id(db_session, task_id) is not None

    deleted = TaskService.delete(db_session, task_id)
    assert deleted is True
    assert TaskService.get_by_id(db_session, task_id) is None


def test_missing_task_handling(db_session):
    """Test that missing task IDs return None or False without crashing."""
    non_existent_id = 99999

    assert TaskService.get_by_id(db_session, non_existent_id) is None
    assert TaskService.update(db_session, non_existent_id, TaskUpdate(title="New")) is None
    assert TaskService.update_status(db_session, non_existent_id, TaskStatus.COMPLETED) is None
    assert TaskService.delete(db_session, non_existent_id) is False


def test_dashboard_task_count_calculations(db_session):
    """Test dashboard counts calculation accurately groups by status."""
    # Initially zero
    initial_stats = TaskService.get_dashboard_stats(db_session)
    assert initial_stats.total == 0
    assert initial_stats.pending == 0
    assert initial_stats.in_progress == 0
    assert initial_stats.completed == 0

    # Add 2 Pending, 1 In Progress, 3 Completed
    TaskService.create(db_session, TaskCreate(title="P1", status=TaskStatus.PENDING))
    TaskService.create(db_session, TaskCreate(title="P2", status=TaskStatus.PENDING))
    TaskService.create(db_session, TaskCreate(title="IP1", status=TaskStatus.IN_PROGRESS))
    TaskService.create(db_session, TaskCreate(title="C1", status=TaskStatus.COMPLETED))
    TaskService.create(db_session, TaskCreate(title="C2", status=TaskStatus.COMPLETED))
    TaskService.create(db_session, TaskCreate(title="C3", status=TaskStatus.COMPLETED))

    stats = TaskService.get_dashboard_stats(db_session)
    assert stats.total == 6
    assert stats.pending == 2
    assert stats.in_progress == 1
    assert stats.completed == 3


def test_search_and_filter_logic(db_session):
    """Test searching by title and filtering by status."""
    TaskService.create(db_session, TaskCreate(title="Design UI Mockup", status=TaskStatus.PENDING))
    TaskService.create(db_session, TaskCreate(title="Build API Endpoints", status=TaskStatus.IN_PROGRESS))
    TaskService.create(db_session, TaskCreate(title="Write Unit Tests", status=TaskStatus.COMPLETED))

    # Filter by status
    pending_tasks = TaskService.get_all(db_session, status=TaskStatus.PENDING)
    assert len(pending_tasks) == 1
    assert pending_tasks[0].title == "Design UI Mockup"

    # Search by keyword
    search_results = TaskService.get_all(db_session, search="api")
    assert len(search_results) == 1
    assert search_results[0].title == "Build API Endpoints"

    # Search with no matches
    empty_results = TaskService.get_all(db_session, search="NonExistentKeyword")
    assert len(empty_results) == 0
