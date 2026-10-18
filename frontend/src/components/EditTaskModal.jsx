import React, { useState, useEffect } from 'react';

export default function EditTaskModal({ task, isOpen, onClose, onSave, isSaving }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'Pending');
      setErrors({});
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title cannot be empty.';
    } else if (title.trim().length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await onSave(task.id, {
      title: title.trim(),
      description: description.trim(),
      status,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 id="edit-modal-title" className="modal-title">Edit Task</h3>
            <p className="modal-subtitle">Modify task details and save changes</p>
          </div>
          <button
            id="btn-close-edit-modal"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form id="edit-task-form" onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="edit-task-title" className="form-label">
                Task Title <span className="required-star">*</span>
              </label>
              <input
                id="edit-task-title"
                type="text"
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: undefined }));
                  }
                }}
                disabled={isSaving}
                maxLength={200}
                required
              />
              {errors.title && (
                <p className="form-error-message" role="alert">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-task-description" className="form-label">
                Description
              </label>
              <textarea
                id="edit-task-description"
                className="form-textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-task-status" className="form-label">
                Status
              </label>
              <select
                id="edit-task-status"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isSaving}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              id="btn-cancel-edit-task"
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              id="btn-save-edit-task"
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="button-spinner"></span>
                  <span>Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
