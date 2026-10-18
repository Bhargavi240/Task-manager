import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DashboardStats from '../components/DashboardStats';

describe('DashboardStats Component', () => {
  const mockStats = {
    total: 10,
    pending: 4,
    in_progress: 3,
    completed: 2,
  };

  it('renders all four statistics cards with correct numbers', () => {
    render(<DashboardStats stats={mockStats} activeFilter="All" onFilterChange={vi.fn()} />);

    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();

    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('triggers onFilterChange when a stat card is clicked', () => {
    const handleFilterChange = vi.fn();
    render(<DashboardStats stats={mockStats} activeFilter="All" onFilterChange={handleFilterChange} />);

    fireEvent.click(screen.getByText('Pending'));
    expect(handleFilterChange).toHaveBeenCalledWith('Pending');

    fireEvent.click(screen.getByText('Completed'));
    expect(handleFilterChange).toHaveBeenCalledWith('Completed');
  });
});
