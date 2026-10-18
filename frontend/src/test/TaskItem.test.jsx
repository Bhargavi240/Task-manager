import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TaskItem from '../components/TaskItem';

describe('TaskItem Component', () => {
  const sampleTask = {
    id: 42,
    title: 'Sample Task',
    description: 'Sample description content',
    status: 'Pending',
    created_at: '2026-10-18T10:00:00Z',
    updated_at: '2026-10-18T10:00:00Z',
  };

  it('renders task details, status badge, and action buttons', () => {
    const { container } = render(
      <TaskItem
        task={sampleTask}
        onEditClick={vi.fn()}
        onDeleteClick={vi.fn()}
        onStatusChange={vi.fn()}
        isUpdatingStatus={false}
      />
    );

    expect(screen.getByText('Sample Task')).toBeInTheDocument();
    expect(screen.getByText('Sample description content')).toBeInTheDocument();
    
    // Check status badge
    const badge = container.querySelector('.task-badge');
    expect(badge).toHaveTextContent('Pending');

    expect(screen.getByRole('button', { name: /edit task sample task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete task sample task/i })).toBeInTheDocument();
  });

  it('triggers onEditClick and onDeleteClick when buttons are clicked', () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <TaskItem
        task={sampleTask}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
        onStatusChange={vi.fn()}
        isUpdatingStatus={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /edit task sample task/i }));
    expect(handleEdit).toHaveBeenCalledWith(sampleTask);

    fireEvent.click(screen.getByRole('button', { name: /delete task sample task/i }));
    expect(handleDelete).toHaveBeenCalledWith(sampleTask);
  });

  it('triggers onStatusChange when status dropdown changes', () => {
    const handleStatusChange = vi.fn();

    render(
      <TaskItem
        task={sampleTask}
        onEditClick={vi.fn()}
        onDeleteClick={vi.fn()}
        onStatusChange={handleStatusChange}
        isUpdatingStatus={false}
      />
    );

    const select = screen.getByTitle('Change status');
    fireEvent.change(select, { target: { value: 'Completed' } });

    expect(handleStatusChange).toHaveBeenCalledWith(42, 'Completed');
  });
});
