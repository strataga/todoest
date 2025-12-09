import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../../database/index.js';

describe('InMemoryDatabase', () => {
  beforeEach(() => {
    db.reset();
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton)', async () => {
      const { db: db1 } = await import('../../database/index.js');
      const { db: db2 } = await import('../../database/index.js');

      expect(db1).toBe(db2);
    });
  });

  describe('getCollection', () => {
    it('should return todos collection', () => {
      const todos = db.getCollection('todos');

      expect(todos).toBeInstanceOf(Map);
    });

    it('should return categories collection', () => {
      const categories = db.getCollection('categories');

      expect(categories).toBeInstanceOf(Map);
    });
  });

  describe('seed data', () => {
    it('should have seeded categories', () => {
      const categories = db.getCollection('categories');

      expect(categories.size).toBe(4);
      expect(categories.has('cat-work')).toBe(true);
      expect(categories.has('cat-personal')).toBe(true);
      expect(categories.has('cat-health')).toBe(true);
      expect(categories.has('cat-learning')).toBe(true);
    });

    it('should have seeded todos', () => {
      const todos = db.getCollection('todos');

      expect(todos.size).toBe(5);
    });

    it('should have correct category data', () => {
      const categories = db.getCollection('categories');
      const work = categories.get('cat-work');

      expect(work).toBeDefined();
      expect(work!.name).toBe('Work');
      expect(work!.color).toBe('hsl(152, 35%, 45%)');
    });
  });

  describe('reset', () => {
    it('should clear and reseed data', () => {
      const todos = db.getCollection('todos');
      const categories = db.getCollection('categories');

      // Add extra data
      todos.set('extra-todo', {
        id: 'extra-todo',
        title: 'Extra',
        description: '',
        dueDate: null,
        categoryId: null,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      expect(todos.size).toBe(6);

      db.reset();

      expect(todos.size).toBe(5);
      expect(categories.size).toBe(4);
    });
  });
});
