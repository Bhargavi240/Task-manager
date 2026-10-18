import React from 'react';

export default function TaskItem({
  task,
  onEditClick,
  onDeleteClick,
  onStatusChange,
  isUpdatingStatus,
}) {
  const statusStyles = {
    Pending: {
      badgeClass: 'badge-pending',
      borderClass: 'task-border-pending',
    },
    'In Progress': {
      badgeClass: 'badge-in-progress',
      borderClass: 'task-border-progress',
    },
    Completed: {
      badgeClass: 'badge-completed',
      borderClass: 'task-border-completed',
    },
  };

  const currentStyle = statusStyles[task.status] || statusStyles.Pending;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <article
      id={`task-item-${task.id}`}
      className={`task-item ${currentStyle.borderClass} ${task.status === 'Completed' ? 'task-item-completed' : ''}`}
    >
      <div className="task-main">
        <div className="task-header-line">
          <h3 className="task-title" title={task.title}>
            {task.title}
          </h3>
          <span className={`task-badge ${currentStyle.badgeClass}`}>
            {task.status}
          </span>
        </div>

        {task.description ? (
          <p className="task-description">{task.description}</p>
        ) : (
          <p className="task-description task-description-empty">No description provided.</p>
        )}

        <div className="task-meta">
          <span className="task-meta-time" title={`Created: ${task.created_at}`}>
            Created: {formatDate(task.created_at)}
          </span>
          {task.updated_at && task.updated_at !== task.created_at && (
            <span className="task-meta-time" title={`Updated: ${task.updated_at}`}>
              • Updated: {formatDate(task.updated_at)}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions-row">
        <div className="task-status-control">
          <label htmlFor={`status-select-${task.id}`} className="visually-hidden">
            Change status
          </label>
          <select
            id={`status-select-${task.id}`}
            className="task-status-select"
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            disabled={isUpdatingStatus}
            title="Change status"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="task-button-group">
          <button
            id={`btn-edit-task-${task.id}`}
            className="btn-action btn-action-edit"
            onClick={() => onEditClick(task)}
            title="Edit task"
            aria-label={`Edit task ${task.title}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <span>Edit</span>
          </button>

          <button
            id={`btn-delete-task-${task.id}`}
            className="btn-action btn-action-delete"
            onClick={() => onDeleteClick(task)}
            title="Delete task"
            aria-label={`Delete task ${task.title}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}
