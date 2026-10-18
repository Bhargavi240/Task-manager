import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import TaskForm from '../components/TaskForm';

describe('TaskForm Component', () => {
  it('shows validation error when submitting with empty title', async () => {
    const handleTaskCreated = vi.fn();
    render(<TaskForm onTaskCreated={handleTaskCreated} isSubmitting={false} />);

    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    expect(await screen.findByText(/title is required and cannot be blank/i)).toBeInTheDocument();
    expect(handleTaskCreated).not.toHaveBeenCalled();
  });

  it('submits valid task data and resets input fields', async () => {
    const handleTaskCreated = vi.fn().mockResolvedValue(true);
    render(<TaskForm onTaskCreated={handleTaskCreated} isSubmitting={false} />);

    const titleInput = screen.getByLabelText(/task title/i);
    const descInput = screen.getByLabelText(/description/i);
    const statusSelect = screen.getByLabelText(/initial status/i);

    fireEvent.change(titleInput, { target: { value: 'New Test Task' } });
    fireEvent.change(descInput, { target: { value: 'Task details here' } });
    fireEvent.change(statusSelect, { target: { value: 'In Progress' } });

    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() => {
      expect(handleTaskCreated).toHaveBeenCalledWith({
        title: 'New Test Task',
        description: 'Task details here',
        status: 'In Progress',
      });
    });

    expect(titleInput.value).toBe('');
    expect(descInput.value).toBe('');
  });
});
