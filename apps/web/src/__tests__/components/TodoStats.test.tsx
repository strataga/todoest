import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import { TodoStats } from '@/components/TodoStats';
import type { Todo } from '@/types/todo';

const mockTodos: Todo[] = [
  {
    id: 'todo-1',
    title: 'Test 1',
    description: '',
    dueDate: '2025-12-31',
    categoryId: null,
    completed: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'todo-2',
    title: 'Test 2',
    description: '',
    dueDate: null,
    categoryId: null,
    completed: true,
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
  {
    id: 'todo-3',
    title: 'Test 3',
    description: '',
    dueDate: null,
    categoryId: null,
    completed: false,
    createdAt: '2025-01-03T00:00:00.000Z',
    updatedAt: '2025-01-03T00:00:00.000Z',
  },
];

describe('TodoStats', () => {
  it('should display total count', () => {
    render(<TodoStats />, {
      preloadedState: {
        todos: { items: mockTodos, fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
        categories: { items: [], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
        filters: { status: 'all', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
      },
    });

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
  });

  it('should display completed count', () => {
    render(<TodoStats />, {
      preloadedState: {
        todos: { items: mockTodos, fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
        categories: { items: [], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
        filters: { status: 'all', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
      },
    });

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should display active count', () => {
    render(<TodoStats />, {
      preloadedState: {
        todos: { items: mockTodos, fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
        categories: { items: [], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
        filters: { status: 'all', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
      },
    });

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should show zero counts for empty list', () => {
    render(<TodoStats />, {
      preloadedState: {
        todos: { items: [], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
        categories: { items: [], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
        filters: { status: 'all', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
      },
    });

    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBe(3);
  });
});
