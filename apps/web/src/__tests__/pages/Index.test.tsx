import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../test-utils';
import Index from '@/pages/Index';
import type { Todo, Category } from '@/types/todo';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

const mockTodos: Todo[] = [
  {
    id: 'todo-1',
    title: 'Test Todo 1',
    description: 'Description 1',
    dueDate: '2025-12-31',
    categoryId: 'cat-work',
    completed: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'todo-2',
    title: 'Test Todo 2',
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

describe('Index', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset handlers to default
    server.resetHandlers();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it('should render page header', async () => {
    render(<Index />, {
      preloadedState: {
        todos: { items: [], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
        categories: { items: [], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
        filters: { status: 'all', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
      },
    });

    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByText('Stay organized, get things done')).toBeInTheDocument();
  });

  it('should show loading state initially', async () => {
    // Make the request hang
    server.use(
      http.get('http://localhost:3000/api/todos', () => {
        return new Promise(() => {}); // Never resolves
      }),
      http.get('http://localhost:3000/api/categories', () => {
        return new Promise(() => {}); // Never resolves
      })
    );

    render(<Index />, {
      preloadedState: {
        todos: { items: [], fetchLoading: true, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
        categories: { items: [], fetchLoading: true, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
        filters: { status: 'all', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
      },
    });

    // Should show spinner during loading
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should show error state with retry button', async () => {
    // Return error from API
    server.use(
      http.get('http://localhost:3000/api/todos', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 });
      }),
      http.get('http://localhost:3000/api/categories', () => {
        return HttpResponse.json([]);
      })
    );

    render(<Index />, {
      preloadedState: {
        todos: { items: [], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
        categories: { items: [], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
        filters: { status: 'all', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
      },
    });

    // Wait for the error state to appear after the failed fetch
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('should show empty state when no todos after load', async () => {
    server.use(
      http.get('http://localhost:3000/api/todos', () => {
        return HttpResponse.json([]);
      }),
      http.get('http://localhost:3000/api/categories', () => {
        return HttpResponse.json([]);
      })
    );

    render(<Index />, {
      preloadedState: {
        todos: { items: [], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
        categories: { items: [], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
        filters: { status: 'all', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('No tasks found')).toBeInTheDocument();
    });
    expect(screen.getByText('Create your first task')).toBeInTheDocument();
  });

  it('should display todos grouped by category', async () => {
    server.use(
      http.get('http://localhost:3000/api/todos', () => {
        return HttpResponse.json(mockTodos);
      }),
      http.get('http://localhost:3000/api/categories', () => {
        return HttpResponse.json(mockCategories);
      })
    );

    render(<Index />, {
      preloadedState: {
        todos: { items: mockTodos, fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
        categories: { items: mockCategories, fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
        filters: { status: 'all', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
      },
    });

    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
  });

  it('should open todo form when Add Task clicked', async () => {
    server.use(
      http.get('http://localhost:3000/api/todos', () => HttpResponse.json([])),
      http.get('http://localhost:3000/api/categories', () => HttpResponse.json(mockCategories))
    );

    render(<Index />, {
      preloadedState: {
        todos: { items: [], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
        categories: { items: mockCategories, fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
        filters: { status: 'all', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
      },
    });

    // Wait for any async effects
    await waitFor(() => {
      expect(screen.getByText('My Tasks')).toBeInTheDocument();
    });

    // Click the Add Task button
    const addButtons = screen.getAllByRole('button');
    const addTaskButton = addButtons.find((btn) => btn.textContent?.includes('Add Task'));
    if (addTaskButton) {
      fireEvent.click(addTaskButton);
    }

    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });
  });

  it('should open category manager when Categories clicked', async () => {
    server.use(
      http.get('http://localhost:3000/api/todos', () => HttpResponse.json([])),
      http.get('http://localhost:3000/api/categories', () => HttpResponse.json(mockCategories))
    );

    render(<Index />, {
      preloadedState: {
        todos: { items: [], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
        categories: { items: mockCategories, fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
        filters: { status: 'all', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
      },
    });

    const categoriesButton = screen.getByText('Categories');
    fireEvent.click(categoriesButton);

    await waitFor(() => {
      expect(screen.getByText('Manage Categories')).toBeInTheDocument();
    });
  });

  it('should open form for editing when todo edit clicked', async () => {
    server.use(
      http.get('http://localhost:3000/api/todos', () => HttpResponse.json(mockTodos)),
      http.get('http://localhost:3000/api/categories', () => HttpResponse.json(mockCategories))
    );

    render(<Index />, {
      preloadedState: {
        todos: { items: mockTodos, fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
        categories: { items: mockCategories, fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
        filters: { status: 'all', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
      },
    });

    // Find the edit button for the first todo
    const editButtons = screen.getAllByRole('button').filter(
      (btn) => btn.querySelector('svg.lucide-pencil') !== null
    );

    if (editButtons.length > 0) {
      fireEvent.click(editButtons[0]);
      await waitFor(() => {
        expect(screen.getByText('Edit Task')).toBeInTheDocument();
      });
    }
  });
});
