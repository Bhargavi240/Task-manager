import React from 'react';

export default function DashboardStats({ stats, activeFilter, onFilterChange }) {
  const cards = [
    {
      id: 'stat-total',
      label: 'Total Tasks',
      count: stats?.total ?? 0,
      filterValue: 'All',
      colorClass: 'stat-total',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
    },
    {
      id: 'stat-pending',
      label: 'Pending',
      count: stats?.pending ?? 0,
      filterValue: 'Pending',
      colorClass: 'stat-pending',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
    },
    {
      id: 'stat-in-progress',
      label: 'In Progress',
      count: stats?.in_progress ?? 0,
      filterValue: 'In Progress',
      colorClass: 'stat-progress',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
        </svg>
      ),
    },
    {
      id: 'stat-completed',
      label: 'Completed',
      count: stats?.completed ?? 0,
      filterValue: 'Completed',
      colorClass: 'stat-completed',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
    },
  ];

  return (
    <section className="dashboard-stats-grid" aria-label="Task Statistics">
      {cards.map((card) => {
        const isSelected = activeFilter === card.filterValue;
        return (
          <div
            key={card.id}
            id={card.id}
            className={`stat-card ${card.colorClass} ${isSelected ? 'stat-card-active' : ''}`}
            onClick={() => onFilterChange(card.filterValue)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onFilterChange(card.filterValue);
              }
            }}
            title={`Filter by ${card.label}`}
          >
            <div className="stat-card-header">
              <span className="stat-label">{card.label}</span>
              <div className="stat-icon-wrapper">{card.icon}</div>
            </div>
            <div className="stat-card-body">
              <span className="stat-number">{card.count}</span>
              <span className="stat-hint">
                {isSelected ? '● Filtering active' : 'Click to filter'}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
