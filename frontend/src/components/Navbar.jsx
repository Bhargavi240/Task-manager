import React from 'react';

export default function Navbar({ backendStatus, onRefresh }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 className="brand-title">TaskFlow</h1>
            <span className="brand-subtitle">FastAPI + React Task Manager</span>
          </div>
        </div>

        <div className="navbar-actions">
          <div className={`status-pill status-${backendStatus}`}>
            <span className="status-dot"></span>
            <span className="status-text">
              {backendStatus === 'online' && 'API Connected'}
              {backendStatus === 'offline' && 'API Disconnected'}
              {backendStatus === 'checking' && 'Connecting...'}
            </span>
          </div>

          <button
            id="btn-refresh-all"
            className="btn btn-secondary btn-icon"
            onClick={onRefresh}
            title="Refresh tasks & stats"
            aria-label="Refresh tasks"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}
