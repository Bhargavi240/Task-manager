import React, { useState } from 'react';

export default function TaskForm({ onTaskCreated, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required and cannot be blank.';
    } else if (title.trim().length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await onTaskCreated({
      title: title.trim(),
      description: description.trim(),
      status,
    });

    if (success) {
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setErrors({});
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setStatus('Pending');
    setErrors({});
  };

  return (
    <section className="card task-form-card" aria-labelledby="form-heading">
      <div className="card-header">
        <div className="card-header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <div>
          <h2 id="form-heading" className="card-title">Create New Task</h2>
          <p className="card-subtitle">Add a task with title, description, and initial status</p>
        </div>
      </div>

      <form id="create-task-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="task-title-input" className="form-label">
            Task Title <span className="required-star">*</span>
          </label>
          <input
            id="task-title-input"
            type="text"
            className={`form-input ${errors.title ? 'input-error' : ''}`}
            placeholder="e.g., Set up database migration"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                setErrors((prev) => ({ ...prev, title: undefined }));
              }
            }}
            disabled={isSubmitting}
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
          <label htmlFor="task-description-input" className="form-label">
            Description <span className="optional-tag">(Optional)</span>
          </label>
          <textarea
            id="task-description-input"
            className="form-textarea"
            placeholder="Add relevant notes, details, or acceptance criteria..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-row">
          <div className="form-group form-group-half">
            <label htmlFor="task-status-select" className="form-label">
              Initial Status
            </label>
            <select
              id="task-status-select"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              id="btn-reset-task-form"
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={isSubmitting || (!title && !description)}
            >
              Clear
            </button>
            <button
              id="btn-submit-task"
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="button-spinner"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>Add Task</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
