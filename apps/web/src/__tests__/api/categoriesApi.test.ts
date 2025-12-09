import { describe, it, expect, beforeEach } from 'vitest';
import { categoriesApi } from '@/api/categoriesApi';
import { resetMockData } from '../mocks/handlers';

describe('categoriesApi', () => {
  beforeEach(() => {
    resetMockData();
  });

  describe('getAll', () => {
    it('should fetch all categories', async () => {
      const categories = await categoriesApi.getAll();

      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });
  });

  describe('getById', () => {
    it('should fetch a category by id', async () => {
      const category = await categoriesApi.getById('cat-work');

      expect(category.id).toBe('cat-work');
      expect(category.name).toBe('Work');
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const newCategory = await categoriesApi.create({
        name: 'New Category',
        color: 'hsl(200, 50%, 50%)',
      });

      expect(newCategory.id).toBeDefined();
      expect(newCategory.name).toBe('New Category');
      expect(newCategory.color).toBe('hsl(200, 50%, 50%)');
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updated = await categoriesApi.update('cat-work', {
        name: 'Updated Work',
      });

      expect(updated.id).toBe('cat-work');
      expect(updated.name).toBe('Updated Work');
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      await expect(categoriesApi.delete('cat-work')).resolves.toBeUndefined();
    });
  });
});
