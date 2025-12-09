import { describe, it, expect, beforeEach } from 'vitest';
import { CategoryRepository } from '../../repositories/CategoryRepository.js';
import { db } from '../../database/index.js';

describe('CategoryRepository', () => {
  let repo: CategoryRepository;

  beforeEach(() => {
    db.reset();
    repo = new CategoryRepository();
  });

  describe('create', () => {
    it('should create a category with required fields', () => {
      const category = repo.create({
        name: 'Test Category',
        color: 'hsl(200, 50%, 50%)',
      });

      expect(category.id).toBeDefined();
      expect(category.name).toBe('Test Category');
      expect(category.color).toBe('hsl(200, 50%, 50%)');
      expect(category.icon).toBeUndefined();
    });

    it('should create a category with optional icon', () => {
      const category = repo.create({
        name: 'Test Category',
        color: 'hsl(200, 50%, 50%)',
        icon: 'star',
      });

      expect(category.icon).toBe('star');
    });
  });

  describe('findById', () => {
    it('should find an existing category', () => {
      const created = repo.create({
        name: 'Test',
        color: 'hsl(0, 0%, 50%)',
      });
      const found = repo.findById(created.id);

      expect(found).toEqual(created);
    });

    it('should find seeded categories', () => {
      const workCategory = repo.findById('cat-work');

      expect(workCategory).toBeDefined();
      expect(workCategory!.name).toBe('Work');
    });

    it('should return undefined for non-existent category', () => {
      const found = repo.findById('non-existent');

      expect(found).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all categories including seeded ones', () => {
      const categories = repo.findAll();

      // Seeded data includes 4 categories
      expect(categories.length).toBeGreaterThanOrEqual(4);
    });

    it('should include newly created categories', () => {
      const initialCount = repo.findAll().length;
      repo.create({ name: 'New', color: 'hsl(0, 0%, 0%)' });
      const categories = repo.findAll();

      expect(categories.length).toBe(initialCount + 1);
    });
  });

  describe('update', () => {
    it('should update an existing category', () => {
      const created = repo.create({
        name: 'Original',
        color: 'hsl(0, 0%, 50%)',
      });
      const updated = repo.update(created.id, { name: 'Updated' });

      expect(updated).toBeDefined();
      expect(updated!.name).toBe('Updated');
      expect(updated!.color).toBe('hsl(0, 0%, 50%)');
    });

    it('should update multiple fields', () => {
      const created = repo.create({
        name: 'Original',
        color: 'hsl(0, 0%, 50%)',
      });
      const updated = repo.update(created.id, {
        name: 'Updated',
        color: 'hsl(100, 50%, 50%)',
        icon: 'folder',
      });

      expect(updated!.name).toBe('Updated');
      expect(updated!.color).toBe('hsl(100, 50%, 50%)');
      expect(updated!.icon).toBe('folder');
    });

    it('should return undefined for non-existent category', () => {
      const updated = repo.update('non-existent', { name: 'Updated' });

      expect(updated).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete an existing category', () => {
      const created = repo.create({
        name: 'To Delete',
        color: 'hsl(0, 0%, 50%)',
      });
      const result = repo.delete(created.id);

      expect(result).toBe(true);
      expect(repo.findById(created.id)).toBeUndefined();
    });

    it('should return false for non-existent category', () => {
      const result = repo.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
