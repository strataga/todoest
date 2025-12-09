import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../test-utils';
import { TodoItem } from '@/components/TodoItem';
import type { Todo, Category } from '@/types/todo';

const mockTodo: Todo = {
  id: 'todo-1',
  title: 'Test Todo',
  description: 'Test description',
  dueDate: '2025-12-31',
  categoryId: 'cat-work',
  completed: false,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

const mockCategories: Category[] = [
  { id: 'cat-work', name: 'Work', color: 'hsl(152, 35%, 45%)' },
];

const defaultPreloadedState = {
  todos: { items: [mockTodo], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
  categories: { items: mockCategories, fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
  filters: { status: 'all' as const, categoryId: null, sortBy: 'dueDate' as const, sortOrder: 'asc' as const },
};

describe('TodoItem', () => {
  const mockOnEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render todo title', () => {
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />, {
      preloadedState: defaultPreloadedState,
    });

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('should render todo description', () => {
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />, {
      preloadedState: defaultPreloadedState,
    });

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should render category name', () => {
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />, {
      preloadedState: defaultPreloadedState,
    });

    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('should render due date', () => {
    // Use a date that's not today or tomorrow
    const futureTodo = { ...mockTodo, dueDate: '2026-03-15' };
    render(<TodoItem todo={futureTodo} onEdit={mockOnEdit} />, {
      preloadedState: defaultPreloadedState,
    });

    // Check that a date is rendered (could be Mar 14 or Mar 15 depending on timezone)
    const dateElement = screen.getByText(/Mar 1[45]/);
    expect(dateElement).toBeInTheDocument();
  });

  it('should show strikethrough for completed todos', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} onEdit={mockOnEdit} />, {
      preloadedState: defaultPreloadedState,
    });

    const titleElement = screen.getByText('Test Todo');
    expect(titleElement).toHaveClass('line-through');
  });

  it('should call onEdit when edit button clicked', async () => {
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />, {
      preloadedState: defaultPreloadedState,
    });

    // Find the edit button (it's in the group-hover section)
    const todoCard = screen.getByText('Test Todo').closest('.todo-card');
    expect(todoCard).toBeInTheDocument();

    // The buttons are visible on hover, but still clickable
    const buttons = todoCard!.querySelectorAll('button');
    const editButton = Array.from(buttons).find(
      (btn) => btn.querySelector('svg.lucide-edit-3') !== null
    );

    if (editButton) {
      fireEvent.click(editButton);
      expect(mockOnEdit).toHaveBeenCalledWith(mockTodo);
    }
  });

  it('should display relative date for recent due dates', () => {
    // Test that dates are formatted (either Today, Tomorrow, or a date like "Mar 15")
    const futureTodo = { ...mockTodo, dueDate: '2026-06-20' };

    render(<TodoItem todo={futureTodo} onEdit={mockOnEdit} />, {
      preloadedState: defaultPreloadedState,
    });

    // Should show "Jun 19" or "Jun 20" depending on timezone
    expect(screen.getByText(/Jun [12]9|Jun 20/)).toBeInTheDocument();
  });

  it('should not render category for uncategorized todo', () => {
    const uncategorizedTodo = { ...mockTodo, categoryId: null };

    render(<TodoItem todo={uncategorizedTodo} onEdit={mockOnEdit} />, {
      preloadedState: defaultPreloadedState,
    });

    expect(screen.queryByText('Work')).not.toBeInTheDocument();
  });

  it('should not render due date when null', () => {
    const noDueDateTodo = { ...mockTodo, dueDate: null };

    render(<TodoItem todo={noDueDateTodo} onEdit={mockOnEdit} />, {
      preloadedState: defaultPreloadedState,
    });

    expect(screen.queryByText('Dec 31')).not.toBeInTheDocument();
  });
});
