import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TaskFilter from '../components/TaskFilter';

describe('TaskFilter Component', () => {
  it('renders search input and all status tabs', () => {
    render(
      <TaskFilter
        statusFilter="All"
        onStatusChange={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
        totalMatching={5}
      />
    );

    expect(screen.getByPlaceholderText(/search tasks by title/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Pending' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'In Progress' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Completed' })).toBeInTheDocument();
    expect(screen.getByText('5 tasks found')).toBeInTheDocument();
  });

  it('handles search input and tab selection', () => {
    const handleSearchChange = vi.fn();
    const handleStatusChange = vi.fn();

    render(
      <TaskFilter
        statusFilter="All"
        onStatusChange={handleStatusChange}
        searchQuery="database"
        onSearchChange={handleSearchChange}
        totalMatching={1}
      />
    );

    const input = screen.getByPlaceholderText(/search tasks by title/i);
    fireEvent.change(input, { target: { value: 'postgres' } });
    expect(handleSearchChange).toHaveBeenCalledWith('postgres');

    // Click clear search button
    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearBtn);
    expect(handleSearchChange).toHaveBeenCalledWith('');

    // Click In Progress tab
    fireEvent.click(screen.getByRole('tab', { name: 'In Progress' }));
    expect(handleStatusChange).toHaveBeenCalledWith('In Progress');
  });
});
