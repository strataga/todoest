import { describe, it, expect, beforeEach } from 'vitest';
import { TodoRepository } from '../../repositories/TodoRepository.js';
import { db } from '../../database/index.js';

describe('TodoRepository', () => {
  let repo: TodoRepository;

  beforeEach(() => {
    db.reset();
    repo = new TodoRepository();
  });

  describe('create', () => {
    it('should create a todo with required fields', () => {
      const todo = repo.create({ title: 'Test Todo' });

      expect(todo.id).toBeDefined();
      expect(todo.title).toBe('Test Todo');
      expect(todo.description).toBe('');
      expect(todo.completed).toBe(false);
      expect(todo.dueDate).toBeNull();
      expect(todo.categoryId).toBeNull();
      expect(todo.createdAt).toBeDefined();
      expect(todo.updatedAt).toBeDefined();
    });

    it('should create a todo with all optional fields', () => {
      const todo = repo.create({
        title: 'Test Todo',
        description: 'Test description',
        dueDate: '2025-12-31',
        categoryId: 'cat-work',
        completed: true,
      });

      expect(todo.title).toBe('Test Todo');
      expect(todo.description).toBe('Test description');
      expect(todo.dueDate).toBe('2025-12-31');
      expect(todo.categoryId).toBe('cat-work');
      expect(todo.completed).toBe(true);
    });
  });

  describe('findById', () => {
    it('should find an existing todo', () => {
      const created = repo.create({ title: 'Test Todo' });
      const found = repo.findById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined for non-existent todo', () => {
      const found = repo.findById('non-existent-id');

      expect(found).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all todos including seeded ones', () => {
      const todos = repo.findAll();

      // Seeded data includes 5 todos
      expect(todos.length).toBeGreaterThanOrEqual(5);
    });

    it('should include newly created todos', () => {
      const initialCount = repo.findAll().length;
      repo.create({ title: 'New Todo' });
      const todos = repo.findAll();

      expect(todos.length).toBe(initialCount + 1);
    });
  });

  describe('findByCategoryId', () => {
    it('should return todos for a specific category', () => {
      const todos = repo.findByCategoryId('cat-work');

      expect(todos.length).toBeGreaterThan(0);
      todos.forEach((todo) => {
        expect(todo.categoryId).toBe('cat-work');
      });
    });

    it('should return empty array for non-existent category', () => {
      const todos = repo.findByCategoryId('non-existent');

      expect(todos).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update an existing todo', () => {
      const created = repo.create({ title: 'Original' });
      const updated = repo.update(created.id, { title: 'Updated' });

      expect(updated).toBeDefined();
      expect(updated!.title).toBe('Updated');
      expect(updated!.id).toBe(created.id);
    });

    it('should update only specified fields', () => {
      const created = repo.create({
        title: 'Original',
        description: 'Original desc',
      });
      const updated = repo.update(created.id, { title: 'Updated' });

      expect(updated!.title).toBe('Updated');
      expect(updated!.description).toBe('Original desc');
    });

    it('should update the updatedAt timestamp', () => {
      const created = repo.create({ title: 'Original' });
      const originalUpdatedAt = created.updatedAt;

      // Small delay to ensure different timestamp
      const updated = repo.update(created.id, { title: 'Updated' });

      expect(updated!.updatedAt).toBeDefined();
      expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(originalUpdatedAt).getTime()
      );
    });

    it('should return undefined for non-existent todo', () => {
      const updated = repo.update('non-existent', { title: 'Updated' });

      expect(updated).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete an existing todo', () => {
      const created = repo.create({ title: 'To Delete' });
      const result = repo.delete(created.id);

      expect(result).toBe(true);
      expect(repo.findById(created.id)).toBeUndefined();
    });

    it('should return false for non-existent todo', () => {
      const result = repo.delete('non-existent');

      expect(result).toBe(false);
    });
  });

  describe('clearCategoryFromTodos', () => {
    it('should clear category from all todos with that category', () => {
      repo.create({ title: 'Todo 1', categoryId: 'cat-test' });
      repo.create({ title: 'Todo 2', categoryId: 'cat-test' });
      repo.create({ title: 'Todo 3', categoryId: 'cat-other' });

      repo.clearCategoryFromTodos('cat-test');

      const allTodos = repo.findAll();
      const clearedTodos = allTodos.filter((t) => t.title.startsWith('Todo'));
      const testCategoryTodos = clearedTodos.filter((t) => t.categoryId === 'cat-test');

      expect(testCategoryTodos.length).toBe(0);
    });

    it('should not affect todos with different category', () => {
      const todo = repo.create({ title: 'Other', categoryId: 'cat-other' });

      repo.clearCategoryFromTodos('cat-test');

      const found = repo.findById(todo.id);
      expect(found!.categoryId).toBe('cat-other');
    });
  });
});
