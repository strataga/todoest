import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../test-utils';
import { TodoFilters } from '@/components/TodoFilters';
import type { Category, Todo } from '@/types/todo';

const mockTodos: Todo[] = [
  {
    id: 'todo-1',
    title: 'Test 1',
    description: '',
    dueDate: null,
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
];

const mockCategories: Category[] = [
  { id: 'cat-work', name: 'Work', color: 'hsl(152, 35%, 45%)' },
  { id: 'cat-personal', name: 'Personal', color: 'hsl(262, 52%, 55%)' },
];

const defaultPreloadedState = {
  todos: { items: mockTodos, fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
  categories: { items: mockCategories, fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
  filters: {
    status: 'all' as const,
    categoryId: null,
    sortBy: 'dueDate' as const,
    sortOrder: 'asc' as const,
  },
};

describe('TodoFilters', () => {
  it('should render status filter buttons', () => {
    render(<TodoFilters />, { preloadedState: defaultPreloadedState });

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should render sort options', () => {
    render(<TodoFilters />, { preloadedState: defaultPreloadedState });

    expect(screen.getByText('Due Date')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
  });

  it('should change status filter when button clicked', () => {
    const { store } = render(<TodoFilters />, { preloadedState: defaultPreloadedState });

    fireEvent.click(screen.getByText('Active'));

    expect(store.getState().filters.status).toBe('active');
  });

  it('should change to completed filter', () => {
    const { store } = render(<TodoFilters />, { preloadedState: defaultPreloadedState });

    fireEvent.click(screen.getByText('Completed'));

    expect(store.getState().filters.status).toBe('completed');
  });

  it('should change sort by option', () => {
    const { store } = render(<TodoFilters />, { preloadedState: defaultPreloadedState });

    fireEvent.click(screen.getByText('Created'));

    expect(store.getState().filters.sortBy).toBe('createdAt');
  });

  it('should toggle sort order when clicking same sort option', () => {
    const { store } = render(<TodoFilters />, { preloadedState: defaultPreloadedState });

    // Click Due Date again (it's already selected)
    fireEvent.click(screen.getByText('Due Date'));

    expect(store.getState().filters.sortOrder).toBe('desc');
  });

  it('should display counts for each filter', () => {
    render(<TodoFilters />, { preloadedState: defaultPreloadedState });

    // All: 2, Active: 1, Completed: 1
    expect(screen.getByText('2')).toBeInTheDocument();
    const ones = screen.getAllByText('1');
    expect(ones.length).toBe(2);
  });
});
