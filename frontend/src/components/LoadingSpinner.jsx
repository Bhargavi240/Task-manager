import React from 'react';

export default function LoadingSpinner({ size = 'medium', text = 'Loading...' }) {
  const sizeClasses = {
    small: 'spinner-sm',
    medium: 'spinner-md',
    large: 'spinner-lg',
  };

  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className={`spinner-circle ${sizeClasses[size] || 'spinner-md'}`}></div>
      {text && <span className="spinner-text">{text}</span>}
    </div>
  );
}
