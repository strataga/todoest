import { describe, it, expect, beforeEach } from 'vitest';
import { TodoService } from '../../services/TodoService.js';
import { TodoRepository } from '../../repositories/TodoRepository.js';
import { CategoryRepository } from '../../repositories/CategoryRepository.js';
import { ApiError } from '../../utils/ApiError.js';
import { db } from '../../database/index.js';

describe('TodoService', () => {
  let service: TodoService;
  let todoRepo: TodoRepository;
  let categoryRepo: CategoryRepository;

  beforeEach(() => {
    db.reset();
    todoRepo = new TodoRepository();
    categoryRepo = new CategoryRepository();
    service = new TodoService(todoRepo, categoryRepo);
  });

  describe('create', () => {
    it('should create a todo without category', () => {
      const todo = service.create({ title: 'Test Todo' });

      expect(todo.id).toBeDefined();
      expect(todo.title).toBe('Test Todo');
    });

    it('should create a todo with valid category', () => {
      const todo = service.create({
        title: 'Test Todo',
        categoryId: 'cat-work',
      });

      expect(todo.categoryId).toBe('cat-work');
    });

    it('should throw error for invalid category', () => {
      expect(() =>
        service.create({
          title: 'Test Todo',
          categoryId: 'invalid-category',
        })
      ).toThrow(ApiError);

      try {
        service.create({ title: 'Test', categoryId: 'invalid' });
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(400);
        expect((error as ApiError).message).toBe('Category not found');
      }
    });
  });

  describe('findById', () => {
    it('should return a todo when found', () => {
      const created = service.create({ title: 'Test' });
      const found = service.findById(created.id);

      expect(found).toEqual(created);
    });

    it('should throw error when todo not found', () => {
      expect(() => service.findById('non-existent')).toThrow(ApiError);

      try {
        service.findById('non-existent');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(404);
        expect((error as ApiError).code).toBe('NOT_FOUND');
      }
    });
  });

  describe('findAll', () => {
    it('should return all todos', () => {
      const todos = service.findAll();

      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBeGreaterThan(0);
    });
  });

  describe('update', () => {
    it('should update an existing todo', () => {
      const created = service.create({ title: 'Original' });
      const updated = service.update(created.id, { title: 'Updated' });

      expect(updated.title).toBe('Updated');
    });

    it('should update todo with valid category', () => {
      const created = service.create({ title: 'Test' });
      const updated = service.update(created.id, { categoryId: 'cat-work' });

      expect(updated.categoryId).toBe('cat-work');
    });

    it('should throw error for invalid category on update', () => {
      const created = service.create({ title: 'Test' });

      expect(() => service.update(created.id, { categoryId: 'invalid' })).toThrow(ApiError);
    });

    it('should throw error when todo not found', () => {
      expect(() => service.update('non-existent', { title: 'Updated' })).toThrow(ApiError);

      try {
        service.update('non-existent', { title: 'Updated' });
      } catch (error) {
        expect((error as ApiError).statusCode).toBe(404);
      }
    });
  });

  describe('delete', () => {
    it('should delete an existing todo', () => {
      const created = service.create({ title: 'To Delete' });

      expect(() => service.delete(created.id)).not.toThrow();
      expect(() => service.findById(created.id)).toThrow(ApiError);
    });

    it('should throw error when todo not found', () => {
      expect(() => service.delete('non-existent')).toThrow(ApiError);

      try {
        service.delete('non-existent');
      } catch (error) {
        expect((error as ApiError).statusCode).toBe(404);
      }
    });
  });

  describe('toggleComplete', () => {
    it('should toggle completion status from false to true', () => {
      const created = service.create({ title: 'Test', completed: false });
      const toggled = service.toggleComplete(created.id);

      expect(toggled.completed).toBe(true);
    });

    it('should toggle completion status from true to false', () => {
      const created = service.create({ title: 'Test', completed: true });
      const toggled = service.toggleComplete(created.id);

      expect(toggled.completed).toBe(false);
    });

    it('should throw error when todo not found', () => {
      expect(() => service.toggleComplete('non-existent')).toThrow(ApiError);
    });
  });
});
