import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { db } from '../../database/index.js';

describe('Category Routes', () => {
  beforeEach(() => {
    db.reset();
  });

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      const response = await request(app).get('/api/categories');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const response = await request(app).post('/api/categories').send({
        name: 'New Category',
        color: 'hsl(200, 50%, 50%)',
      });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('New Category');
      expect(response.body.color).toBe('hsl(200, 50%, 50%)');
      expect(response.body.id).toBeDefined();
    });

    it('should create a category with icon', async () => {
      const response = await request(app).post('/api/categories').send({
        name: 'Icon Category',
        color: 'hsl(100, 50%, 50%)',
        icon: 'star',
      });

      expect(response.status).toBe(201);
      expect(response.body.icon).toBe('star');
    });

    it('should return 400 for missing name', async () => {
      const response = await request(app).post('/api/categories').send({
        color: 'hsl(0, 0%, 50%)',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for missing color', async () => {
      const response = await request(app).post('/api/categories').send({
        name: 'No Color',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return a category by id', async () => {
      const response = await request(app).get('/api/categories/cat-work');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Work');
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app).get('/api/categories/non-existent');

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PATCH /api/categories/:id', () => {
    it('should update a category', async () => {
      const createResponse = await request(app).post('/api/categories').send({
        name: 'Original',
        color: 'hsl(0, 50%, 50%)',
      });

      const response = await request(app).patch(`/api/categories/${createResponse.body.id}`).send({
        name: 'Updated',
      });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated');
      expect(response.body.color).toBe('hsl(0, 50%, 50%)');
    });

    it('should update multiple fields', async () => {
      const createResponse = await request(app).post('/api/categories').send({
        name: 'Original',
        color: 'hsl(0, 50%, 50%)',
      });

      const response = await request(app).patch(`/api/categories/${createResponse.body.id}`).send({
        name: 'Updated',
        color: 'hsl(100, 50%, 50%)',
        icon: 'folder',
      });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated');
      expect(response.body.color).toBe('hsl(100, 50%, 50%)');
      expect(response.body.icon).toBe('folder');
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app).patch('/api/categories/non-existent').send({
        name: 'Updated',
      });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      const createResponse = await request(app).post('/api/categories').send({
        name: 'To Delete',
        color: 'hsl(0, 50%, 50%)',
      });

      const response = await request(app).delete(`/api/categories/${createResponse.body.id}`);

      expect(response.status).toBe(204);

      // Verify it's deleted
      const getResponse = await request(app).get(`/api/categories/${createResponse.body.id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should clear category from todos when deleted', async () => {
      // Create a category
      const catResponse = await request(app).post('/api/categories').send({
        name: 'Will Delete',
        color: 'hsl(0, 50%, 50%)',
      });

      // Create todo with that category
      const todoResponse = await request(app).post('/api/todos').send({
        title: 'Has Category',
        categoryId: catResponse.body.id,
      });

      // Delete category
      await request(app).delete(`/api/categories/${catResponse.body.id}`);

      // Verify todo's category is cleared
      const todoCheck = await request(app).get(`/api/todos/${todoResponse.body.id}`);
      expect(todoCheck.body.categoryId).toBeNull();
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app).delete('/api/categories/non-existent');

      expect(response.status).toBe(404);
    });
  });
});
