import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { db } from '../../database/index.js';

describe('Todo Routes', () => {
  beforeEach(() => {
    db.reset();
  });

  describe('GET /api/todos', () => {
    it('should return all todos', async () => {
      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const response = await request(app).post('/api/todos').send({
        title: 'New Todo',
        description: 'Test description',
      });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New Todo');
      expect(response.body.description).toBe('Test description');
      expect(response.body.id).toBeDefined();
    });

    it('should create a todo with category', async () => {
      const response = await request(app).post('/api/todos').send({
        title: 'Categorized Todo',
        categoryId: 'cat-work',
      });

      expect(response.status).toBe(201);
      expect(response.body.categoryId).toBe('cat-work');
    });

    it('should return 400 for invalid category', async () => {
      const response = await request(app).post('/api/todos').send({
        title: 'Bad Todo',
        categoryId: 'invalid-category',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for missing title', async () => {
      const response = await request(app).post('/api/todos').send({
        description: 'No title',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for empty title', async () => {
      const response = await request(app).post('/api/todos').send({
        title: '',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/todos/:id', () => {
    it('should return a todo by id', async () => {
      const createResponse = await request(app).post('/api/todos').send({
        title: 'Find Me',
      });

      const response = await request(app).get(`/api/todos/${createResponse.body.id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Find Me');
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app).get('/api/todos/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PATCH /api/todos/:id', () => {
    it('should update a todo', async () => {
      const createResponse = await request(app).post('/api/todos').send({
        title: 'Original',
      });

      const response = await request(app).patch(`/api/todos/${createResponse.body.id}`).send({
        title: 'Updated',
        description: 'New description',
      });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated');
      expect(response.body.description).toBe('New description');
    });

    it('should partially update a todo', async () => {
      const createResponse = await request(app).post('/api/todos').send({
        title: 'Original',
        description: 'Original desc',
      });

      const response = await request(app).patch(`/api/todos/${createResponse.body.id}`).send({
        completed: true,
      });

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);
      expect(response.body.title).toBe('Original');
      expect(response.body.description).toBe('Original desc');
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app).patch('/api/todos/non-existent').send({
        title: 'Updated',
      });

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid category on update', async () => {
      const createResponse = await request(app).post('/api/todos').send({
        title: 'Test',
      });

      const response = await request(app).patch(`/api/todos/${createResponse.body.id}`).send({
        categoryId: 'invalid-category',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      const createResponse = await request(app).post('/api/todos').send({
        title: 'To Delete',
      });

      const response = await request(app).delete(`/api/todos/${createResponse.body.id}`);

      expect(response.status).toBe(204);

      // Verify it's deleted
      const getResponse = await request(app).get(`/api/todos/${createResponse.body.id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app).delete('/api/todos/non-existent');

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/todos/:id/toggle', () => {
    it('should toggle todo completion status', async () => {
      const createResponse = await request(app).post('/api/todos').send({
        title: 'Toggle Me',
        completed: false,
      });

      const response = await request(app).patch(`/api/todos/${createResponse.body.id}/toggle`);

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);

      // Toggle again
      const response2 = await request(app).patch(`/api/todos/${createResponse.body.id}/toggle`);
      expect(response2.body.completed).toBe(false);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app).patch('/api/todos/non-existent/toggle');

      expect(response.status).toBe(404);
    });
  });
});

describe('Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.timestamp).toBeDefined();
  });
});
