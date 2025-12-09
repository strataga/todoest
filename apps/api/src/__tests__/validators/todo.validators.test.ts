import { describe, it, expect } from 'vitest';
import { createTodoSchema, updateTodoSchema, idParamSchema } from '../../validators/todo.validators.js';

describe('Todo Validators', () => {
  describe('createTodoSchema', () => {
    it('should accept valid todo with only title', () => {
      const result = createTodoSchema.safeParse({ title: 'Test Todo' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Test Todo');
        expect(result.data.description).toBe('');
        expect(result.data.completed).toBe(false);
      }
    });

    it('should accept valid todo with all fields', () => {
      const result = createTodoSchema.safeParse({
        title: 'Test Todo',
        description: 'Description',
        dueDate: '2025-12-31',
        categoryId: 'cat-1',
        completed: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Test Todo');
        expect(result.data.description).toBe('Description');
        expect(result.data.dueDate).toBe('2025-12-31');
        expect(result.data.categoryId).toBe('cat-1');
        expect(result.data.completed).toBe(true);
      }
    });

    it('should reject empty title', () => {
      const result = createTodoSchema.safeParse({ title: '' });

      expect(result.success).toBe(false);
    });

    it('should reject missing title', () => {
      const result = createTodoSchema.safeParse({});

      expect(result.success).toBe(false);
    });

    it('should reject title longer than 255 characters', () => {
      const result = createTodoSchema.safeParse({ title: 'a'.repeat(256) });

      expect(result.success).toBe(false);
    });

    it('should reject description longer than 1000 characters', () => {
      const result = createTodoSchema.safeParse({
        title: 'Test',
        description: 'a'.repeat(1001),
      });

      expect(result.success).toBe(false);
    });

    it('should accept null dueDate', () => {
      const result = createTodoSchema.safeParse({
        title: 'Test',
        dueDate: null,
      });

      expect(result.success).toBe(true);
    });

    it('should accept null categoryId', () => {
      const result = createTodoSchema.safeParse({
        title: 'Test',
        categoryId: null,
      });

      expect(result.success).toBe(true);
    });
  });

  describe('updateTodoSchema', () => {
    it('should accept empty object (no updates)', () => {
      const result = updateTodoSchema.safeParse({});

      expect(result.success).toBe(true);
    });

    it('should accept partial updates', () => {
      const result = updateTodoSchema.safeParse({ title: 'Updated' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Updated');
      }
    });

    it('should accept all fields', () => {
      const result = updateTodoSchema.safeParse({
        title: 'Updated',
        description: 'New desc',
        dueDate: '2025-12-31',
        categoryId: 'cat-1',
        completed: true,
      });

      expect(result.success).toBe(true);
    });

    it('should reject empty title if provided', () => {
      const result = updateTodoSchema.safeParse({ title: '' });

      expect(result.success).toBe(false);
    });

    it('should reject title longer than 255 if provided', () => {
      const result = updateTodoSchema.safeParse({ title: 'a'.repeat(256) });

      expect(result.success).toBe(false);
    });
  });

  describe('idParamSchema', () => {
    it('should accept valid id', () => {
      const result = idParamSchema.safeParse({ id: 'test-id-123' });

      expect(result.success).toBe(true);
    });

    it('should reject empty id', () => {
      const result = idParamSchema.safeParse({ id: '' });

      expect(result.success).toBe(false);
    });

    it('should reject missing id', () => {
      const result = idParamSchema.safeParse({});

      expect(result.success).toBe(false);
    });
  });
});
