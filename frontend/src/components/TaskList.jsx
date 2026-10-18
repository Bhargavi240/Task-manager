import React from 'react';
import TaskItem from './TaskItem';
import LoadingSpinner from './LoadingSpinner';

export default function TaskList({
  tasks,
  loading,
  onEditClick,
  onDeleteClick,
  onStatusChange,
  statusUpdatingId,
  hasActiveFilters,
  onResetFilters,
}) {
  if (loading) {
    return (
      <div className="task-list-loading">
        <LoadingSpinner text="Fetching your tasks..." size="large" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty" id="empty-tasks-state">
        <div className="empty-state-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </div>
        <h3 className="empty-state-title">No tasks found</h3>
        <p className="empty-state-text">
          {hasActiveFilters
            ? 'No tasks match your current search or status filter criteria.'
            : 'You have not added any tasks yet. Create your first task using the form above!'}
        </p>
        {hasActiveFilters && (
          <button
            id="btn-empty-reset-filters"
            className="btn btn-secondary"
            onClick={onResetFilters}
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="task-list" id="task-list-container">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onStatusChange={onStatusChange}
          isUpdatingStatus={statusUpdatingId === task.id}
        />
      ))}
    </div>
  );
}
