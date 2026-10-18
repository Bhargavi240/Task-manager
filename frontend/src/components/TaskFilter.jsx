import React from 'react';

export default function TaskFilter({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  totalMatching,
}) {
  const statuses = [
    { label: 'All', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
  ];

  return (
    <div className="filter-panel">
      <div className="search-box">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          id="task-search-input"
          type="text"
          className="search-input"
          placeholder="Search tasks by title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            id="btn-clear-search"
            className="clear-search-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      <div className="filter-status-group" role="tablist" aria-label="Status filters">
        {statuses.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              id={`filter-${tab.value.toLowerCase().replace(/\s+/g, '-')}`}
              role="tab"
              aria-selected={isActive}
              className={`filter-tab ${isActive ? 'filter-tab-active' : ''}`}
              onClick={() => onStatusChange(tab.value)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="filter-summary">
        <span className="filter-counter">
          {totalMatching} {totalMatching === 1 ? 'task' : 'tasks'} found
        </span>
      </div>
    </div>
  );
}
