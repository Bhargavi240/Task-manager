def test_health_endpoint(client):
    """Test GET /health returns 200 and healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "healthy" in data["message"].lower()


def test_root_endpoint(client):
    """Test GET / returns welcome message."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "docs" in data


def test_create_task_successfully(client):
    """Test POST /tasks creates a new task with 201 status code."""
    payload = {
        "title": "Build Frontend Dashboard",
        "description": "Create statistics cards and filters",
        "status": "In Progress",
    }
    response = client.post("/tasks", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["title"] == payload["title"]
    assert data["description"] == payload["description"]
    assert data["status"] == "In Progress"
    assert "created_at" in data
    assert "updated_at" in data


def test_create_task_defaults(client):
    """Test POST /tasks creates task with default status Pending."""
    payload = {"title": "Write Documentation"}
    response = client.post("/tasks", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "Pending"
    assert data["description"] == ""


def test_create_task_invalid_data(client):
    """Test POST /tasks with empty title or invalid status returns 422 Unprocessable Entity."""
    # Empty title
    response_empty = client.post("/tasks", json={"title": ""})
    assert response_empty.status_code == 422

    # Whitespace only title
    response_whitespace = client.post("/tasks", json={"title": "   "})
    assert response_whitespace.status_code == 422

    # Missing title
    response_missing = client.post("/tasks", json={"description": "No title provided"})
    assert response_missing.status_code == 422

    # Invalid status value
    response_bad_status = client.post(
        "/tasks",
        json={"title": "Valid title", "status": "NotRealStatus"},
    )
    assert response_bad_status.status_code == 422


def test_retrieve_all_tasks(client):
    """Test GET /tasks returns an array of tasks."""
    # Create two tasks
    client.post("/tasks", json={"title": "Task 1", "status": "Pending"})
    client.post("/tasks", json={"title": "Task 2", "status": "Completed"})

    response = client.get("/tasks")
    assert response.status_code == 200
    tasks = response.json()
    assert isinstance(tasks, list)
    assert len(tasks) == 2


def test_retrieve_tasks_with_filtering_and_search(client):
    """Test GET /tasks with status query and search query."""
    client.post("/tasks", json={"title": "Set up Postgres", "status": "Pending"})
    client.post("/tasks", json={"title": "Set up SQLite", "status": "Completed"})
    client.post("/tasks", json={"title": "Write documentation", "status": "Pending"})

    # Filter by status
    resp_pending = client.get("/tasks?status=Pending")
    assert resp_pending.status_code == 200
    pending_tasks = resp_pending.json()
    assert len(pending_tasks) == 2
    for t in pending_tasks:
        assert t["status"] == "Pending"

    # Search by keyword
    resp_search = client.get("/tasks?search=sqlite")
    assert resp_search.status_code == 200
    search_tasks = resp_search.json()
    assert len(search_tasks) == 1
    assert "SQLite" in search_tasks[0]["title"]


def test_retrieve_task_by_id(client):
    """Test GET /tasks/{task_id} retrieves a specific task."""
    create_resp = client.post(
        "/tasks",
        json={"title": "Specific Task", "description": "Needs review"},
    )
    task_id = create_resp.json()["id"]

    response = client.get(f"/tasks/{task_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["title"] == "Specific Task"
    assert data["description"] == "Needs review"


def test_retrieve_task_by_id_nonexistent(client):
    """Test GET /tasks/{task_id} returns 404 for nonexistent task."""
    response = client.get("/tasks/99999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_update_task(client):
    """Test PUT /tasks/{task_id} updates all or partial fields."""
    create_resp = client.post(
        "/tasks",
        json={"title": "Old Title", "description": "Old Desc", "status": "Pending"},
    )
    task_id = create_resp.json()["id"]

    update_payload = {
        "title": "New Title",
        "description": "New Desc",
        "status": "In Progress",
    }
    response = client.put(f"/tasks/{task_id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["title"] == "New Title"
    assert data["description"] == "New Desc"
    assert data["status"] == "In Progress"


def test_update_task_nonexistent(client):
    """Test PUT /tasks/{task_id} returns 404 when task does not exist."""
    response = client.put("/tasks/99999", json={"title": "Nonexistent"})
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_update_task_invalid_data(client):
    """Test PUT /tasks/{task_id} returns 422 on invalid payload."""
    create_resp = client.post("/tasks", json={"title": "Valid Initial"})
    task_id = create_resp.json()["id"]

    # Invalid empty title
    response = client.put(f"/tasks/{task_id}", json={"title": "  "})
    assert response.status_code == 422


def test_update_task_status(client):
    """Test PATCH /tasks/{task_id}/status updates only status."""
    create_resp = client.post("/tasks", json={"title": "Status Patch Task"})
    task_id = create_resp.json()["id"]

    # Update to In Progress
    response = client.patch(f"/tasks/{task_id}/status", json={"status": "In Progress"})
    assert response.status_code == 200
    assert response.json()["status"] == "In Progress"

    # Update to Completed
    response2 = client.patch(f"/tasks/{task_id}/status", json={"status": "Completed"})
    assert response2.status_code == 200
    assert response2.json()["status"] == "Completed"


def test_update_task_status_invalid_or_nonexistent(client):
    """Test PATCH /tasks/{task_id}/status handles 404 and 422 correctly."""
    # Nonexistent task -> 404
    resp_404 = client.patch("/tasks/99999/status", json={"status": "Completed"})
    assert resp_404.status_code == 404

    # Existing task with invalid status string -> 422
    create_resp = client.post("/tasks", json={"title": "Target Task"})
    task_id = create_resp.json()["id"]

    resp_422 = client.patch(f"/tasks/{task_id}/status", json={"status": "DoneAndDusted"})
    assert resp_422.status_code == 422


def test_delete_task(client):
    """Test DELETE /tasks/{task_id} deletes the task."""
    create_resp = client.post("/tasks", json={"title": "Delete Me Soon"})
    task_id = create_resp.json()["id"]

    delete_resp = client.delete(f"/tasks/{task_id}")
    assert delete_resp.status_code == 200
    assert "deleted" in delete_resp.json()["message"].lower()

    # Verify task no longer exists
    get_resp = client.get(f"/tasks/{task_id}")
    assert get_resp.status_code == 404


def test_delete_task_nonexistent(client):
    """Test DELETE /tasks/{task_id} returns 404 if task does not exist."""
    response = client.delete("/tasks/99999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_dashboard_stats_endpoint(client):
    """Test GET /tasks/stats/summary returns proper counts."""
    # Empty
    stats_empty = client.get("/tasks/stats/summary").json()
    assert stats_empty == {"total": 0, "pending": 0, "in_progress": 0, "completed": 0}

    # Add tasks
    client.post("/tasks", json={"title": "T1", "status": "Pending"})
    client.post("/tasks", json={"title": "T2", "status": "In Progress"})
    client.post("/tasks", json={"title": "T3", "status": "Completed"})

    stats_filled = client.get("/tasks/stats/summary").json()
    assert stats_filled == {"total": 3, "pending": 1, "in_progress": 1, "completed": 1}
