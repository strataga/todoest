import { describe, it, expect } from 'vitest';
import { ApiError } from '../../utils/ApiError.js';

describe('ApiError', () => {
  describe('constructor', () => {
    it('should create an error with all properties', () => {
      const error = new ApiError(400, 'Bad request', 'BAD_REQUEST', { field: ['error'] });

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Bad request');
      expect(error.code).toBe('BAD_REQUEST');
      expect(error.details).toEqual({ field: ['error'] });
      expect(error.name).toBe('ApiError');
    });

    it('should be an instance of Error', () => {
      const error = new ApiError(500, 'Error', 'ERROR');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
    });

    it('should have a stack trace', () => {
      const error = new ApiError(500, 'Error', 'ERROR');

      expect(error.stack).toBeDefined();
    });
  });

  describe('badRequest', () => {
    it('should create a 400 error', () => {
      const error = ApiError.badRequest('Invalid input');

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid input');
      expect(error.code).toBe('BAD_REQUEST');
    });

    it('should include details when provided', () => {
      const error = ApiError.badRequest('Invalid input', { name: ['Required'] });

      expect(error.details).toEqual({ name: ['Required'] });
    });
  });

  describe('notFound', () => {
    it('should create a 404 error', () => {
      const error = ApiError.notFound('Todo');

      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Todo not found');
      expect(error.code).toBe('NOT_FOUND');
    });

    it('should format message with resource name', () => {
      const error = ApiError.notFound('Category');

      expect(error.message).toBe('Category not found');
    });
  });

  describe('conflict', () => {
    it('should create a 409 error', () => {
      const error = ApiError.conflict('Resource already exists');

      expect(error.statusCode).toBe(409);
      expect(error.message).toBe('Resource already exists');
      expect(error.code).toBe('CONFLICT');
    });
  });
});
