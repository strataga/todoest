import { describe, it, expect, beforeEach } from 'vitest';
import { todosApi } from '@/api/todosApi';
import { resetMockData } from '../mocks/handlers';

describe('todosApi', () => {
  beforeEach(() => {
    resetMockData();
  });

  describe('getAll', () => {
    it('should fetch all todos', async () => {
      const todos = await todosApi.getAll();

      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBeGreaterThan(0);
    });
  });

  describe('getById', () => {
    it('should fetch a todo by id', async () => {
      const todo = await todosApi.getById('todo-1');

      expect(todo.id).toBe('todo-1');
      expect(todo.title).toBe('Test Todo 1');
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const newTodo = await todosApi.create({
        title: 'New Todo',
        description: 'Test',
      });

      expect(newTodo.id).toBeDefined();
      expect(newTodo.title).toBe('New Todo');
      expect(newTodo.description).toBe('Test');
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updated = await todosApi.update('todo-1', {
        title: 'Updated Title',
      });

      expect(updated.id).toBe('todo-1');
      expect(updated.title).toBe('Updated Title');
    });
  });

  describe('delete', () => {
    it('should delete a todo', async () => {
      await expect(todosApi.delete('todo-1')).resolves.toBeUndefined();
    });
  });

  describe('toggleComplete', () => {
    it('should toggle completion status', async () => {
      const original = await todosApi.getById('todo-1');
      const toggled = await todosApi.toggleComplete('todo-1');

      expect(toggled.completed).toBe(!original.completed);
    });
  });
});
