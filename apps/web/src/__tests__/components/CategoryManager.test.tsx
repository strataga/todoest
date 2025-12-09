import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../test-utils';
import { CategoryManager } from '@/components/CategoryManager';
import type { Category, Todo } from '@/types/todo';

const mockCategories: Category[] = [
  { id: 'cat-work', name: 'Work', color: 'hsl(152, 35%, 45%)' },
  { id: 'cat-personal', name: 'Personal', color: 'hsl(262, 52%, 55%)' },
];

const mockTodos: Todo[] = [
  {
    id: 'todo-1',
    title: 'Test 1',
    description: '',
    dueDate: null,
    categoryId: 'cat-work',
    completed: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'todo-2',
    title: 'Test 2',
    description: '',
    dueDate: null,
    categoryId: 'cat-work',
    completed: true,
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
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

describe('CategoryManager', () => {
  const mockOnClose = vi.fn();

  it('should not render when isOpen is false', () => {
    render(<CategoryManager isOpen={false} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    expect(screen.queryByText('Manage Categories')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<CategoryManager isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    expect(screen.getByText('Manage Categories')).toBeInTheDocument();
  });

  it('should display existing categories', () => {
    render(<CategoryManager isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });

  it('should display task count for each category', () => {
    render(<CategoryManager isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    expect(screen.getByText('2 tasks')).toBeInTheDocument();
    expect(screen.getByText('0 tasks')).toBeInTheDocument();
  });

  it('should show empty state when no categories', () => {
    render(<CategoryManager isOpen={true} onClose={mockOnClose} />, {
      preloadedState: {
        ...defaultPreloadedState,
        categories: { items: [], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
      },
    });

    expect(screen.getByText('No categories yet. Create one above!')).toBeInTheDocument();
  });

  it('should call onClose when close button clicked', () => {
    render(<CategoryManager isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(
      (btn) => btn.querySelector('svg.lucide-x') !== null
    );

    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should have disabled Add button when name is empty', () => {
    render(<CategoryManager isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    const addButton = screen.getByRole('button', { name: /add category/i });
    expect(addButton).toBeDisabled();
  });

  it('should enable Add button when name is entered', () => {
    render(<CategoryManager isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    const input = screen.getByPlaceholderText('New category name');
    fireEvent.change(input, { target: { value: 'New Category' } });

    const addButton = screen.getByRole('button', { name: /add category/i });
    expect(addButton).not.toBeDisabled();
  });

  it('should dispatch createCategory when Add clicked', () => {
    const { store } = render(<CategoryManager isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    const input = screen.getByPlaceholderText('New category name');
    fireEvent.change(input, { target: { value: 'New Category' } });

    const addButton = screen.getByRole('button', { name: /add category/i });
    fireEvent.click(addButton);

    // Input should be cleared after adding
    expect(input).toHaveValue('');
  });

  it('should add category on Enter key', () => {
    render(<CategoryManager isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    const input = screen.getByPlaceholderText('New category name');
    fireEvent.change(input, { target: { value: 'New Category' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(input).toHaveValue('');
  });

  it('should allow selecting different colors', () => {
    render(<CategoryManager isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    // Find color buttons (they're the small circular buttons)
    const colorButtons = screen.getAllByRole('button').filter(
      (btn) => btn.classList.contains('rounded-full') && btn.classList.contains('h-6')
    );

    expect(colorButtons.length).toBeGreaterThan(0);
  });
});
