import React, { useEffect } from 'react';

export default function Notification({ notification, onClose }) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const isError = notification.type === 'error';
  const icon = isError ? '⚠️' : '✅';

  return (
    <div
      id="notification-toast"
      className={`notification-toast ${isError ? 'toast-error' : 'toast-success'}`}
      role="alert"
    >
      <span className="toast-icon">{icon}</span>
      <div className="toast-content">
        <strong className="toast-title">{isError ? 'Error' : 'Success'}</strong>
        <p className="toast-message">{notification.message}</p>
      </div>
      <button
        id="btn-close-notification"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
