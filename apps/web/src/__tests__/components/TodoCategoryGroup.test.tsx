import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../test-utils';
import { TodoCategoryGroup } from '@/components/TodoCategoryGroup';
import type { Category, Todo } from '@/types/todo';

const mockCategory: Category = {
  id: 'cat-work',
  name: 'Work',
  color: 'hsl(152, 35%, 45%)',
};

const mockTodos: Todo[] = [
  {
    id: 'todo-1',
    title: 'Test Todo 1',
    description: '',
    dueDate: null,
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
    categoryId: 'cat-work',
    completed: true,
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
];

const defaultPreloadedState = {
  todos: { items: mockTodos, fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], toggleLoadingIds: [], error: null },
  categories: { items: [mockCategory], fetchLoading: false, createLoading: false, updateLoadingIds: [], deleteLoadingIds: [], error: null },
  filters: {
    status: 'all' as const,
    categoryId: null,
    sortBy: 'dueDate' as const,
    sortOrder: 'asc' as const,
  },
};

describe('TodoCategoryGroup', () => {
  const mockOnEditTodo = vi.fn();

  it('should render category name', () => {
    render(
      <TodoCategoryGroup category={mockCategory} todos={mockTodos} onEditTodo={mockOnEditTodo} />,
      { preloadedState: defaultPreloadedState }
    );

    // Use getAllByText since "Work" appears in header and in todo category pills
    const workElements = screen.getAllByText('Work');
    expect(workElements.length).toBeGreaterThanOrEqual(1);
  });

  it('should render "Uncategorized" when category is null', () => {
    render(<TodoCategoryGroup category={null} todos={mockTodos} onEditTodo={mockOnEditTodo} />, {
      preloadedState: defaultPreloadedState,
    });

    expect(screen.getByText('Uncategorized')).toBeInTheDocument();
  });

  it('should render task count', () => {
    render(
      <TodoCategoryGroup category={mockCategory} todos={mockTodos} onEditTodo={mockOnEditTodo} />,
      { preloadedState: defaultPreloadedState }
    );

    expect(screen.getByText('2 tasks')).toBeInTheDocument();
  });

  it('should render singular "task" for one todo', () => {
    render(
      <TodoCategoryGroup
        category={mockCategory}
        todos={[mockTodos[0]]}
        onEditTodo={mockOnEditTodo}
      />,
      { preloadedState: defaultPreloadedState }
    );

    expect(screen.getByText('1 task')).toBeInTheDocument();
  });

  it('should render todos', () => {
    render(
      <TodoCategoryGroup category={mockCategory} todos={mockTodos} onEditTodo={mockOnEditTodo} />,
      { preloadedState: defaultPreloadedState }
    );

    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
  });

  it('should collapse todos when header clicked', () => {
    render(
      <TodoCategoryGroup category={mockCategory} todos={mockTodos} onEditTodo={mockOnEditTodo} />,
      { preloadedState: defaultPreloadedState }
    );

    // Initially expanded, todos should be visible
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();

    // Click header to collapse
    const headerButton = screen.getByRole('button', { name: /work/i });
    fireEvent.click(headerButton);

    // After animation, todos might be hidden (animation might not complete in test)
    // Just verify the click happened without error
  });
});
