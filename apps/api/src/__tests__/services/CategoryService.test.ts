import { describe, it, expect, beforeEach } from 'vitest';
import { CategoryService } from '../../services/CategoryService.js';
import { CategoryRepository } from '../../repositories/CategoryRepository.js';
import { TodoRepository } from '../../repositories/TodoRepository.js';
import { ApiError } from '../../utils/ApiError.js';
import { db } from '../../database/index.js';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepo: CategoryRepository;
  let todoRepo: TodoRepository;

  beforeEach(() => {
    db.reset();
    categoryRepo = new CategoryRepository();
    todoRepo = new TodoRepository();
    service = new CategoryService(categoryRepo, todoRepo);
  });

  describe('create', () => {
    it('should create a category', () => {
      const category = service.create({
        name: 'Test Category',
        color: 'hsl(200, 50%, 50%)',
      });

      expect(category.id).toBeDefined();
      expect(category.name).toBe('Test Category');
      expect(category.color).toBe('hsl(200, 50%, 50%)');
    });

    it('should create a category with icon', () => {
      const category = service.create({
        name: 'Test',
        color: 'hsl(0, 0%, 0%)',
        icon: 'star',
      });

      expect(category.icon).toBe('star');
    });
  });

  describe('findById', () => {
    it('should return a category when found', () => {
      const created = service.create({
        name: 'Test',
        color: 'hsl(0, 0%, 0%)',
      });
      const found = service.findById(created.id);

      expect(found).toEqual(created);
    });

    it('should find seeded categories', () => {
      const found = service.findById('cat-work');

      expect(found.name).toBe('Work');
    });

    it('should throw error when category not found', () => {
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
    it('should return all categories', () => {
      const categories = service.findAll();

      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('update', () => {
    it('should update an existing category', () => {
      const created = service.create({
        name: 'Original',
        color: 'hsl(0, 0%, 50%)',
      });
      const updated = service.update(created.id, { name: 'Updated' });

      expect(updated.name).toBe('Updated');
      expect(updated.color).toBe('hsl(0, 0%, 50%)');
    });

    it('should throw error when category not found', () => {
      expect(() => service.update('non-existent', { name: 'Updated' })).toThrow(ApiError);

      try {
        service.update('non-existent', { name: 'Updated' });
      } catch (error) {
        expect((error as ApiError).statusCode).toBe(404);
      }
    });
  });

  describe('delete', () => {
    it('should delete an existing category', () => {
      const created = service.create({
        name: 'To Delete',
        color: 'hsl(0, 0%, 50%)',
      });

      expect(() => service.delete(created.id)).not.toThrow();
      expect(() => service.findById(created.id)).toThrow(ApiError);
    });

    it('should clear category from todos when deleted', () => {
      const category = service.create({
        name: 'Test Category',
        color: 'hsl(0, 0%, 50%)',
      });

      // Create todos with this category
      todoRepo.create({ title: 'Todo 1', categoryId: category.id });
      todoRepo.create({ title: 'Todo 2', categoryId: category.id });

      service.delete(category.id);

      // Verify todos have category cleared
      const todos = todoRepo.findAll();
      const relevantTodos = todos.filter((t) => t.title.startsWith('Todo '));
      relevantTodos.forEach((todo) => {
        expect(todo.categoryId).toBeNull();
      });
    });

    it('should throw error when category not found', () => {
      expect(() => service.delete('non-existent')).toThrow(ApiError);

      try {
        service.delete('non-existent');
      } catch (error) {
        expect((error as ApiError).statusCode).toBe(404);
      }
    });
  });
});
