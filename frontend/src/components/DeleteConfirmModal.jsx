import React from 'react';

export default function DeleteConfirmModal({
  task,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) {
  if (!isOpen || !task) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="modal-container modal-danger" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="danger-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div>
            <h3 id="delete-dialog-title" className="modal-title">Delete Task</h3>
            <p className="modal-subtitle">Confirm task deletion</p>
          </div>
          <button
            id="btn-close-delete-modal"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="delete-warning-text">
            Are you sure you want to delete <strong className="delete-task-name">"{task.title}"</strong>?
          </p>
          <p className="delete-sub-text">
            This action cannot be undone and will permanently remove the task from the database.
          </p>
        </div>

        <div className="modal-footer">
          <button
            id="btn-cancel-delete-task"
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            id="btn-confirm-delete-task"
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(task.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="button-spinner"></span>
                <span>Deleting...</span>
              </>
            ) : (
              'Delete Task'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
