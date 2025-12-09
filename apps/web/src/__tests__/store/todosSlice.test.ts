import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import todosReducer, {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  clearError,
} from '@/store/todosSlice';
import { resetMockData } from '../mocks/handlers';

describe('todosSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    resetMockData();
    store = configureStore({
      reducer: { todos: todosReducer },
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().todos;
      expect(state.items).toEqual([]);
      expect(state.fetchLoading).toBe(true);
      expect(state.createLoading).toBe(false);
      expect(state.updateLoadingIds).toEqual([]);
      expect(state.deleteLoadingIds).toEqual([]);
      expect(state.toggleLoadingIds).toEqual([]);
      expect(state.error).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      // First set an error
      store.dispatch({ type: 'todos/fetchTodos/rejected', payload: 'Test error' });

      store.dispatch(clearError());

      expect(store.getState().todos.error).toBeNull();
    });
  });

  describe('fetchTodos', () => {
    it('should fetch todos successfully', async () => {
      await store.dispatch(fetchTodos());

      const state = store.getState().todos;
      expect(state.fetchLoading).toBe(false);
      expect(state.items.length).toBeGreaterThan(0);
      expect(state.error).toBeNull();
    });

    it('should set loading to true when pending', () => {
      store.dispatch({ type: 'todos/fetchTodos/pending' });

      expect(store.getState().todos.fetchLoading).toBe(true);
    });

    it('should handle error on rejection', () => {
      store.dispatch({
        type: 'todos/fetchTodos/rejected',
        payload: 'Failed to fetch',
      });

      const state = store.getState().todos;
      expect(state.fetchLoading).toBe(false);
      expect(state.error).toBe('Failed to fetch');
    });
  });

  describe('createTodo', () => {
    it('should create a todo', async () => {
      const initialLength = store.getState().todos.items.length;

      await store.dispatch(
        createTodo({
          title: 'New Todo',
          description: 'Test description',
        })
      );

      const state = store.getState().todos;
      expect(state.items.length).toBe(initialLength + 1);
      expect(state.items[state.items.length - 1].title).toBe('New Todo');
    });

    it('should set loading when pending', () => {
      store.dispatch({ type: 'todos/createTodo/pending' });

      expect(store.getState().todos.createLoading).toBe(true);
    });

    it('should handle error on rejection', () => {
      store.dispatch({
        type: 'todos/createTodo/rejected',
        payload: 'Failed to create',
      });

      const state = store.getState().todos;
      expect(state.createLoading).toBe(false);
      expect(state.error).toBe('Failed to create');
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      // First fetch todos to have data
      await store.dispatch(fetchTodos());
      const todo = store.getState().todos.items[0];

      await store.dispatch(
        updateTodo({
          id: todo.id,
          updates: { title: 'Updated Title' },
        })
      );

      const state = store.getState().todos;
      const updated = state.items.find((t) => t.id === todo.id);
      expect(updated?.title).toBe('Updated Title');
    });

    it('should clear error on pending', () => {
      // Set an error first
      store.dispatch({ type: 'todos/updateTodo/rejected', payload: 'Error', meta: { arg: { id: 'todo-1' } } });

      store.dispatch({ type: 'todos/updateTodo/pending', meta: { arg: { id: 'todo-1' } } });

      expect(store.getState().todos.error).toBeNull();
    });

    it('should handle error on rejection', () => {
      store.dispatch({
        type: 'todos/updateTodo/rejected',
        payload: 'Failed to update',
        meta: { arg: { id: 'todo-1' } },
      });

      expect(store.getState().todos.error).toBe('Failed to update');
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      // First fetch todos
      await store.dispatch(fetchTodos());
      const initialLength = store.getState().todos.items.length;
      const todoId = store.getState().todos.items[0].id;

      await store.dispatch(deleteTodo(todoId));

      const state = store.getState().todos;
      expect(state.items.length).toBe(initialLength - 1);
      expect(state.items.find((t) => t.id === todoId)).toBeUndefined();
    });

    it('should handle error on rejection', () => {
      store.dispatch({
        type: 'todos/deleteTodo/rejected',
        payload: 'Failed to delete',
        meta: { arg: 'todo-1' },
      });

      expect(store.getState().todos.error).toBe('Failed to delete');
    });
  });

  describe('toggleTodo', () => {
    it('should toggle todo completion', async () => {
      // First fetch todos
      await store.dispatch(fetchTodos());
      const todo = store.getState().todos.items[0];
      const originalCompleted = todo.completed;

      await store.dispatch(toggleTodo(todo.id));

      const updated = store.getState().todos.items.find((t) => t.id === todo.id);
      expect(updated?.completed).toBe(!originalCompleted);
    });

    it('should handle error on rejection', () => {
      store.dispatch({
        type: 'todos/toggleTodo/rejected',
        payload: 'Failed to toggle',
        meta: { arg: 'todo-1' },
      });

      expect(store.getState().todos.error).toBe('Failed to toggle');
    });
  });
});
