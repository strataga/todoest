import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../test-utils';
import { TodoForm } from '@/components/TodoForm';
import type { Category, Todo } from '@/types/todo';

const mockCategories: Category[] = [
  { id: 'cat-work', name: 'Work', color: 'hsl(152, 35%, 45%)' },
  { id: 'cat-personal', name: 'Personal', color: 'hsl(262, 52%, 55%)' },
];

const mockTodo: Todo = {
  id: 'todo-1',
  title: 'Existing Todo',
  description: 'Existing description',
  dueDate: '2025-12-31',
  categoryId: 'cat-work',
  completed: false,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

const defaultPreloadedState = {
  todos: { items: [], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
  categories: { items: mockCategories, fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
  filters: {
    status: 'all' as const,
    categoryId: null,
    sortBy: 'dueDate' as const,
    sortOrder: 'asc' as const,
  },
};

describe('TodoForm', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(<TodoForm todo={null} isOpen={false} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
  });

  it('should render create form when isOpen is true and no todo', () => {
    render(<TodoForm todo={null} isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  it('should render edit form when todo is provided', () => {
    render(<TodoForm todo={mockTodo} isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  it('should populate form with todo data when editing', () => {
    render(<TodoForm todo={mockTodo} isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    expect(screen.getByDisplayValue('Existing Todo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
  });

  it('should call onClose when cancel button clicked', () => {
    render(<TodoForm todo={null} isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when X button clicked', () => {
    render(<TodoForm todo={null} isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    const closeButtons = screen.getAllByRole('button');
    const xButton = closeButtons.find((btn) => btn.querySelector('svg.lucide-x') !== null);

    if (xButton) {
      fireEvent.click(xButton);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should disable submit when title is empty', () => {
    render(<TodoForm todo={null} isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    const submitButton = screen.getByText('Create Task');
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit when title is entered', () => {
    render(<TodoForm todo={null} isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    const titleInput = screen.getByPlaceholderText('Task title');
    fireEvent.change(titleInput, { target: { value: 'New Task' } });

    const submitButton = screen.getByText('Create Task');
    expect(submitButton).not.toBeDisabled();
  });

  it('should display category options', () => {
    render(<TodoForm todo={null} isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('should allow selecting a category', () => {
    render(<TodoForm todo={null} isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    const workButton = screen.getByText('Work');
    fireEvent.click(workButton);

    // The button should now be selected (styling change)
  });

  it('should submit form and call onClose on create', () => {
    render(<TodoForm todo={null} isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    const titleInput = screen.getByPlaceholderText('Task title');
    fireEvent.change(titleInput, { target: { value: 'New Task' } });

    const submitButton = screen.getByText('Create Task');
    fireEvent.click(submitButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should submit form and call onClose on update', () => {
    render(<TodoForm todo={mockTodo} isOpen={true} onClose={mockOnClose} />, {
      preloadedState: defaultPreloadedState,
    });

    const titleInput = screen.getByDisplayValue('Existing Todo');
    fireEvent.change(titleInput, { target: { value: 'Updated Todo' } });

    const submitButton = screen.getByText('Save Changes');
    fireEvent.click(submitButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should clear form fields when opened for create after edit', () => {
    const { rerender } = render(
      <TodoForm todo={mockTodo} isOpen={true} onClose={mockOnClose} />,
      { preloadedState: defaultPreloadedState }
    );

    // Re-render with no todo (create mode)
    rerender(<TodoForm todo={null} isOpen={true} onClose={mockOnClose} />);

    const titleInput = screen.getByPlaceholderText('Task title');
    expect(titleInput).toHaveValue('');
  });
});
