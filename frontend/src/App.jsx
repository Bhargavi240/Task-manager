import React, { useState, useEffect, useCallback } from 'react';
import api from './services/api';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import EditTaskModal from './components/EditTaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Notification from './components/Notification';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, completed: 0 });
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Action states
  const [isCreating, setIsCreating] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  // Modals state
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  // Notifications
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // Check health of backend
  const checkHealth = useCallback(async () => {
    try {
      await api.getHealth();
      setBackendStatus('online');
    } catch {
      setBackendStatus('offline');
    }
  }, []);

  // Fetch dashboard summary counts
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await api.getStats();
      setStats(statsData);
    } catch (err) {
      console.warn('Failed to fetch dashboard stats:', err);
    }
  }, []);

  // Fetch tasks according to current filter and search
  const fetchTasks = useCallback(async (isInitial = false) => {
    if (isInitial) setLoadingTasks(true);
    try {
      const data = await api.getTasks(statusFilter, searchQuery);
      setTasks(data);
      setBackendStatus('online');
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setBackendStatus('offline');
      showNotification(err.message || 'Failed to load tasks from server.', 'error');
    } finally {
      setLoadingTasks(false);
    }
  }, [statusFilter, searchQuery]);

  // Initial load
  useEffect(() => {
    checkHealth();
    fetchStats();
    fetchTasks(true);
  }, [checkHealth, fetchStats, fetchTasks]);

  // Handler for creating a new task
  const handleCreateTask = async (taskData) => {
    setIsCreating(true);
    try {
      const newTask = await api.createTask(taskData);
      showNotification(`Task "${newTask.title}" created successfully!`, 'success');
      await Promise.all([fetchTasks(), fetchStats()]);
      return true;
    } catch (err) {
      showNotification(err.message || 'Failed to create task.', 'error');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  // Handler for updating a task
  const handleSaveEdit = async (id, updatedData) => {
    setIsSavingEdit(true);
    try {
      const updated = await api.updateTask(id, updatedData);
      showNotification(`Task "${updated.title}" updated successfully!`, 'success');
      setEditingTask(null);
      await Promise.all([fetchTasks(), fetchStats()]);
    } catch (err) {
      showNotification(err.message || 'Failed to update task.', 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handler for quick status change
  const handleStatusChange = async (taskId, newStatus) => {
    setStatusUpdatingId(taskId);
    try {
      const updated = await api.updateTaskStatus(taskId, newStatus);
      showNotification(`Status updated to "${updated.status}"`, 'success');
      await Promise.all([fetchTasks(), fetchStats()]);
    } catch (err) {
      showNotification(err.message || 'Failed to change task status.', 'error');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Handler for deleting a task
  const handleConfirmDelete = async (taskId) => {
    setIsDeleting(true);
    try {
      await api.deleteTask(taskId);
      showNotification('Task deleted successfully.', 'success');
      setDeletingTask(null);
      await Promise.all([fetchTasks(), fetchStats()]);
    } catch (err) {
      showNotification(err.message || 'Failed to delete task.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Refresh everything manually
  const handleRefreshAll = async () => {
    setLoadingTasks(true);
    await Promise.all([checkHealth(), fetchStats(), fetchTasks()]);
    showNotification('Tasks and statistics refreshed.', 'success');
  };

  const handleResetFilters = () => {
    setStatusFilter('All');
    setSearchQuery('');
  };

  const hasActiveFilters = statusFilter !== 'All' || searchQuery.trim().length > 0;

  return (
    <div className="app-layout">
      <Navbar backendStatus={backendStatus} onRefresh={handleRefreshAll} />

      <main className="main-content">
        <Notification notification={notification} onClose={closeNotification} />

        {/* Dashboard Stats */}
        <section className="section-dashboard">
          <DashboardStats
            stats={stats}
            activeFilter={statusFilter}
            onFilterChange={(newFilter) => setStatusFilter(newFilter)}
          />
        </section>

        {/* Task Creation Form */}
        <section className="section-create">
          <TaskForm onTaskCreated={handleCreateTask} isSubmitting={isCreating} />
        </section>

        {/* Task List Section with Search and Filter */}
        <section className="section-list">
          <div className="section-header">
            <div>
              <h2 className="section-title">All Tasks</h2>
              <p className="section-subtitle">
                Manage, edit, update status, and track your work
              </p>
            </div>
          </div>

          <TaskFilter
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalMatching={tasks.length}
          />

          <TaskList
            tasks={tasks}
            loading={loadingTasks}
            onEditClick={(task) => setEditingTask(task)}
            onDeleteClick={(task) => setDeletingTask(task)}
            onStatusChange={handleStatusChange}
            statusUpdatingId={statusUpdatingId}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
          />
        </section>
      </main>

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEdit}
        isSaving={isSavingEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        task={deletingTask}
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <footer className="footer">
        <div className="footer-container">
          <p>TaskFlow — Clean & Robust Task Manager with React & FastAPI</p>
          <div className="footer-links">
            <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noopener noreferrer">
              FastAPI Swagger Docs ↗
            </a>
            <span>•</span>
            <a href="http://127.0.0.1:8000/health" target="_blank" rel="noopener noreferrer">
              Health Check ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
