import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import type { Todo } from '@/types/todo';

export function useFilteredTodos() {
  const todos = useAppSelector((state) => state.todos.items);
  const filters = useAppSelector((state) => state.filters);

  return useMemo(() => {
    let filtered = [...todos];

    // Filter by status
    if (filters.status === 'active') {
      filtered = filtered.filter((todo) => !todo.completed);
    } else if (filters.status === 'completed') {
      filtered = filtered.filter((todo) => todo.completed);
    }

    // Filter by category
    if (filters.categoryId) {
      filtered = filtered.filter((todo) => todo.categoryId === filters.categoryId);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      if (filters.sortBy === 'dueDate') {
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        comparison = aDate - bDate;
      } else if (filters.sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [todos, filters]);
}

export function useTodosByCategory() {
  const filteredTodos = useFilteredTodos();
  const categories = useAppSelector((state) => state.categories.items);

  return useMemo(() => {
    const grouped: Record<string, { category: (typeof categories)[0] | null; todos: Todo[] }> = {};

    // Initialize with empty arrays for each category
    categories.forEach((cat) => {
      grouped[cat.id] = { category: cat, todos: [] };
    });

    // Add uncategorized group
    grouped['uncategorized'] = { category: null, todos: [] };

    // Group todos
    filteredTodos.forEach((todo) => {
      const key = todo.categoryId || 'uncategorized';
      if (grouped[key]) {
        grouped[key].todos.push(todo);
      } else {
        grouped['uncategorized'].todos.push(todo);
      }
    });

    // Filter out empty groups and return as array
    return Object.entries(grouped)
      .filter(([_, group]) => group.todos.length > 0)
      .map(([id, group]) => ({
        id,
        ...group,
      }));
  }, [filteredTodos, categories]);
}
