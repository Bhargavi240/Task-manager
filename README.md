# TaskFlow — Modern Task Manager Web Application

[![CI Pipeline](https://github.com/Bhargavi240/Task-manager/actions/workflows/ci.yml/badge.svg)](https://github.com/Bhargavi240/Task-manager/actions/workflows/ci.yml)

A clean, beginner-friendly, and complete full-stack Task Management application built with **Python (FastAPI)**, **SQLAlchemy**, **SQLite**, and **React (Vite)**.

---

## Features

- **Dashboard Statistics**: Real-time summary cards displaying Total Tasks, Pending, In Progress, and Completed task counts.
- **Task Creation**: Add tasks with title, description, and initial status with validation.
- **Task Editing**: Modify task details (title, description, status) via an interactive modal.
- **Status Updates**: Change task status between `Pending`, `In Progress`, and `Completed` instantly.
- **Search & Filter**: Search tasks by title keywords and filter tasks by status tabs or by clicking dashboard stat cards.
- **Safe Deletion**: Delete tasks with an interactive confirmation modal to avoid accidental data loss.
- **User Feedback**: Instant toast notifications for success and error messages, plus live backend connectivity indicator.
- **Automated Tests**: Comprehensive unit tests and API tests using `pytest` and FastAPI `TestClient` with isolated SQLite databases, plus component tests with `Vitest`.
- **Continuous Integration (CI)**: Automated GitHub Actions pipeline running backend unit/API tests and frontend tests/build on every push and pull request to `main`.

---

## Project Structure

```text
task-manager/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI workflow
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── health.py        # Health check endpoint
│   │   │   └── tasks.py         # REST API endpoints for tasks
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── task_service.py  # Business logic & DB queries
│   │   ├── __init__.py
│   │   ├── database.py          # SQLite engine & session management
│   │   ├── models.py            # SQLAlchemy Task model
│   │   ├── schemas.py           # Pydantic validation schemas
│   │   └── main.py              # FastAPI app, CORS & startup initialization
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py          # Isolated in-memory SQLite fixture
│   │   ├── unit/
│   │   │   ├── __init__.py
│   │   │   └── test_task_service.py # Unit tests for service & validation
│   │   └── api/
│   │       ├── __init__.py
│   │       └── test_api.py      # API tests with TestClient
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── DashboardStats.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskFilter.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   ├── EditTaskModal.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   ├── Notification.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── services/
│   │   │   └── api.js           # REST API client
│   │   ├── test/
│   │   │   ├── setup.js         # Vitest DOM setup
│   │   │   ├── DashboardStats.test.jsx
│   │   │   ├── TaskForm.test.jsx
│   │   │   ├── TaskFilter.test.jsx
│   │   │   └── TaskItem.test.jsx
│   │   ├── App.jsx              # Main application view & state
│   │   ├── App.css              # Component styling & responsiveness
│   │   ├── index.css            # Design tokens, reset & variables
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── .env.example
├── .gitignore
└── README.md
```

---

## Prerequisites

Ensure you have the following installed on your machine:
- **Python**: 3.10+ (Tested on Python 3.13)
- **Node.js**: 18+ & **npm** (Tested on Node.js v24 & npm 11)
- **Windows PowerShell**

---

## Setup & Installation (Windows PowerShell)

### 1. Clone or Open the Workspace

Open **Windows PowerShell** in the project directory:
```powershell
cd c:\Users\hp\Desktop\project
```

### 2. Backend Setup

From the project root:
```powershell
# Navigate into backend directory
cd backend

# Create a Python virtual environment
python -m venv .venv

# Activate the virtual environment
.\.venv\Scripts\Activate.ps1

# Upgrade pip and install dependencies
pip install -r requirements.txt
```

*(Optional: Copy environment variables template)*
```powershell
Copy-Item .env.example .env
```

### 3. Frontend Setup

Open a second PowerShell window or navigate to the frontend folder:
```powershell
# Navigate to the frontend directory
cd c:\Users\hp\Desktop\project\frontend

# Install npm packages
npm install
```

*(Optional: Copy environment variables template)*
```powershell
Copy-Item .env.example .env
```

---

## Running the Application

To run the application, start the backend and frontend in **separate terminal windows**:

### Terminal 1: Start Backend (FastAPI)

```powershell
cd c:\Users\hp\Desktop\project\backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- Backend API: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc Documentation: `http://127.0.0.1:8000/redoc`

### Terminal 2: Start Frontend (React + Vite)

```powershell
cd c:\Users\hp\Desktop\project\frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

- Open your browser at: `http://127.0.0.1:5173`

---

## Running Automated Tests

### Backend Automated Tests (Pytest)

All backend tests run in **isolated in-memory SQLite databases** (`sqlite:///:memory:`) and will **never** alter your production or development `tasks.db`.

```powershell
cd c:\Users\hp\Desktop\project\backend
.\.venv\Scripts\Activate.ps1

# Run all backend tests
python -m pytest -v

# Run only unit tests
python -m pytest -v tests/unit/

# Run only API tests
python -m pytest -v tests/api/
```

### Frontend Automated Tests (Vitest)

```powershell
cd c:\Users\hp\Desktop\project\frontend

# Run all component and interaction tests
npm test

# Run tests in watch mode
npm run test:watch

# Run production build
npm run build
```

---

## Continuous Integration (GitHub Actions)

A CI pipeline is configured in `.github/workflows/ci.yml`. It triggers automatically on:
- Every push to the `main` branch.
- Every pull request targeting the `main` branch.

### Workflow Jobs:
1. **`backend-tests`**:
   - Sets up Python 3.12.
   - Installs dependencies from `backend/requirements.txt`.
   - Executes `python -m pytest -v` across all unit and API tests.
2. **`frontend-build-and-test`**:
   - Sets up Node.js 20.
   - Installs dependencies using `npm ci` with `package-lock.json`.
   - Executes `npm test` with Vitest.
   - Runs `npm run build` to verify the production bundle compiles cleanly.

---

## REST API Endpoints

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Check API server health and status | `200 OK` |
| `GET` | `/tasks` | Retrieve all tasks (supports `?status=...` and `?search=...`) | `200 OK` |
| `GET` | `/tasks/stats/summary` | Retrieve dashboard counts (total, pending, in_progress, completed) | `200 OK` |
| `GET` | `/tasks/{task_id}` | Retrieve a single task by ID | `200 OK` / `404 Not Found` |
| `POST` | `/tasks` | Create a new task (`title`, optional `description`, `status`) | `201 Created` / `422 Unprocessable` |
| `PUT` | `/tasks/{task_id}` | Update title, description, and status of an existing task | `200 OK` / `404 Not Found` |
| `PATCH`| `/tasks/{task_id}/status` | Update only the status (`Pending`, `In Progress`, `Completed`) | `200 OK` / `404 Not Found` |
| `DELETE`| `/tasks/{task_id}` | Delete a task by ID | `200 OK` / `404 Not Found` |

---

## Database Schema (`tasks`)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Autoincrement | Unique identifier |
| `title` | `VARCHAR(200)` | NOT NULL | Title of task (1-200 chars) |
| `description`| `TEXT` | Nullable | Detailed task description |
| `status` | `VARCHAR(50)` | NOT NULL, Default: `'Pending'` | Status (`Pending`, `In Progress`, `Completed`) |
| `created_at` | `DATETIME` | NOT NULL | Timestamp when task was created |
| `updated_at` | `DATETIME` | NOT NULL | Timestamp when task was last modified |

The database tables are automatically initialized at backend startup via SQLAlchemy `create_all()`.
