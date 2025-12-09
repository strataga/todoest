import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import todosReducer from '@/store/todosSlice';
import categoriesReducer from '@/store/categoriesSlice';
import filtersReducer from '@/store/filtersSlice';
import { useFilteredTodos, useTodosByCategory } from '@/hooks/useTodos';
import type { Todo, Category } from '@/types/todo';

const mockTodos: Todo[] = [
  {
    id: 'todo-1',
    title: 'Test 1',
    description: '',
    dueDate: '2025-12-31',
    categoryId: 'cat-work',
    completed: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'todo-2',
    title: 'Test 2',
    description: '',
    dueDate: '2025-06-15',
    categoryId: 'cat-personal',
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

const mockCategories: Category[] = [
  { id: 'cat-work', name: 'Work', color: 'hsl(152, 35%, 45%)' },
  { id: 'cat-personal', name: 'Personal', color: 'hsl(262, 52%, 55%)' },
];

const createTestStore = (overrides = {}) =>
  configureStore({
    reducer: {
      todos: todosReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
    },
    preloadedState: {
      todos: { items: mockTodos, loading: false, error: null },
      categories: { items: mockCategories, loading: false, error: null },
      filters: { status: 'all', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
      ...overrides,
    },
  });

const createWrapper = (store: ReturnType<typeof createTestStore>) => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(Provider, { store }, children);
  };
};

describe('useFilteredTodos', () => {
  it('should return all todos when no filters applied', () => {
    const store = createTestStore();
    const { result } = renderHook(() => useFilteredTodos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.length).toBe(3);
  });

  it('should filter by active status', () => {
    const store = createTestStore({
      filters: { status: 'active', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
    });

    const { result } = renderHook(() => useFilteredTodos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.length).toBe(2);
    expect(result.current.every((t) => !t.completed)).toBe(true);
  });

  it('should filter by completed status', () => {
    const store = createTestStore({
      filters: { status: 'completed', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
    });

    const { result } = renderHook(() => useFilteredTodos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.length).toBe(1);
    expect(result.current[0].completed).toBe(true);
  });

  it('should filter by category', () => {
    const store = createTestStore({
      filters: { status: 'all', categoryId: 'cat-work', sortBy: 'dueDate', sortOrder: 'asc' },
    });

    const { result } = renderHook(() => useFilteredTodos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.length).toBe(1);
    expect(result.current[0].categoryId).toBe('cat-work');
  });

  it('should sort by dueDate ascending', () => {
    const store = createTestStore({
      filters: { status: 'all', categoryId: null, sortBy: 'dueDate', sortOrder: 'asc' },
    });

    const { result } = renderHook(() => useFilteredTodos(), {
      wrapper: createWrapper(store),
    });

    // Todos with dates should come before todos without dates
    expect(result.current[0].dueDate).toBe('2025-06-15');
    expect(result.current[1].dueDate).toBe('2025-12-31');
    expect(result.current[2].dueDate).toBeNull();
  });

  it('should sort by dueDate descending', () => {
    const store = createTestStore({
      filters: { status: 'all', categoryId: null, sortBy: 'dueDate', sortOrder: 'desc' },
    });

    const { result } = renderHook(() => useFilteredTodos(), {
      wrapper: createWrapper(store),
    });

    // Null dates should come first when descending (Infinity reversed)
    expect(result.current[0].dueDate).toBeNull();
  });

  it('should sort by createdAt ascending', () => {
    const store = createTestStore({
      filters: { status: 'all', categoryId: null, sortBy: 'createdAt', sortOrder: 'asc' },
    });

    const { result } = renderHook(() => useFilteredTodos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current[0].id).toBe('todo-1');
    expect(result.current[1].id).toBe('todo-2');
    expect(result.current[2].id).toBe('todo-3');
  });

  it('should sort by createdAt descending', () => {
    const store = createTestStore({
      filters: { status: 'all', categoryId: null, sortBy: 'createdAt', sortOrder: 'desc' },
    });

    const { result } = renderHook(() => useFilteredTodos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current[0].id).toBe('todo-3');
    expect(result.current[1].id).toBe('todo-2');
    expect(result.current[2].id).toBe('todo-1');
  });
});

describe('useTodosByCategory', () => {
  it('should group todos by category', () => {
    const store = createTestStore();

    const { result } = renderHook(() => useTodosByCategory(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.length).toBe(3); // work, personal, uncategorized
  });

  it('should include uncategorized group for todos without category', () => {
    const store = createTestStore();

    const { result } = renderHook(() => useTodosByCategory(), {
      wrapper: createWrapper(store),
    });

    const uncategorized = result.current.find((g) => g.id === 'uncategorized');
    expect(uncategorized).toBeDefined();
    expect(uncategorized!.todos.length).toBe(1);
    expect(uncategorized!.category).toBeNull();
  });

  it('should associate category object with group', () => {
    const store = createTestStore();

    const { result } = renderHook(() => useTodosByCategory(), {
      wrapper: createWrapper(store),
    });

    const workGroup = result.current.find((g) => g.id === 'cat-work');
    expect(workGroup).toBeDefined();
    expect(workGroup!.category?.name).toBe('Work');
  });

  it('should filter out empty groups', () => {
    const store = createTestStore({
      todos: { items: [mockTodos[0]], loading: false, error: null },
    });

    const { result } = renderHook(() => useTodosByCategory(), {
      wrapper: createWrapper(store),
    });

    // Only work category should appear (personal has no todos)
    expect(result.current.length).toBe(1);
    expect(result.current[0].id).toBe('cat-work');
  });
});
