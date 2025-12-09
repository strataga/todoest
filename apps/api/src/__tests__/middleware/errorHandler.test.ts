import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../middleware/errorHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ZodError, z } from 'zod';

describe('errorHandler middleware', () => {
  const mockRequest = {} as Request;
  const mockNext = vi.fn() as NextFunction;

  const createMockResponse = () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    return res;
  };

  it('should handle ApiError', () => {
    const mockResponse = createMockResponse();
    const error = ApiError.badRequest('Invalid input', { field: ['error message'] });

    errorHandler(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Invalid input',
        code: 'BAD_REQUEST',
        details: { field: ['error message'] },
      },
    });
  });

  it('should handle ApiError.notFound', () => {
    const mockResponse = createMockResponse();
    const error = ApiError.notFound('Todo');

    errorHandler(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Todo not found',
        code: 'NOT_FOUND',
        details: undefined,
      },
    });
  });

  it('should handle ZodError', () => {
    const mockResponse = createMockResponse();
    const schema = z.object({
      title: z.string().min(1),
      count: z.number(),
    });

    let zodError: ZodError | undefined;
    try {
      schema.parse({ title: '', count: 'not a number' });
    } catch (e) {
      zodError = e as ZodError;
    }

    errorHandler(zodError!, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: expect.any(Object),
        }),
      })
    );
  });

  it('should handle unexpected errors', () => {
    const mockResponse = createMockResponse();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Unexpected error');

    errorHandler(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
    });
    expect(consoleSpy).toHaveBeenCalledWith('Unexpected error:', error);

    consoleSpy.mockRestore();
  });
});
