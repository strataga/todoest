import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { validateRequest } from '../../middleware/validateRequest.js';
import { z } from 'zod';

describe('validateRequest middleware', () => {
  const mockResponse = {} as Response;
  const mockNext = vi.fn() as NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate body and call next on success', () => {
    const schema = z.object({
      title: z.string().min(1),
    });

    const mockRequest = {
      body: { title: 'Test' },
    } as Request;

    const middleware = validateRequest({ body: schema });
    middleware(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(mockRequest.body).toEqual({ title: 'Test' });
  });

  it('should validate params and call next on success', () => {
    const schema = z.object({
      id: z.string().min(1),
    });

    const mockRequest = {
      params: { id: 'test-id' },
    } as unknown as Request;

    const middleware = validateRequest({ params: schema });
    middleware(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should validate query and call next on success', () => {
    const schema = z.object({
      page: z.string().optional(),
    });

    const mockRequest = {
      query: { page: '1' },
    } as unknown as Request;

    const middleware = validateRequest({ query: schema });
    middleware(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should call next with error on body validation failure', () => {
    const schema = z.object({
      title: z.string().min(1),
    });

    const mockRequest = {
      body: { title: '' },
    } as Request;

    const middleware = validateRequest({ body: schema });
    middleware(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(z.ZodError));
  });

  it('should call next with error on params validation failure', () => {
    const schema = z.object({
      id: z.string().min(1),
    });

    const mockRequest = {
      params: { id: '' },
    } as unknown as Request;

    const middleware = validateRequest({ params: schema });
    middleware(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(z.ZodError));
  });

  it('should transform validated data', () => {
    const schema = z.object({
      count: z.string().transform((v) => parseInt(v, 10)),
    });

    const mockRequest = {
      body: { count: '42' },
    } as Request;

    const middleware = validateRequest({ body: schema });
    middleware(mockRequest, mockResponse, mockNext);

    expect(mockRequest.body).toEqual({ count: 42 });
  });

  it('should validate multiple schemas', () => {
    const bodySchema = z.object({
      title: z.string(),
    });
    const paramsSchema = z.object({
      id: z.string(),
    });

    const mockRequest = {
      body: { title: 'Test' },
      params: { id: 'test-id' },
    } as unknown as Request;

    const middleware = validateRequest({ body: bodySchema, params: paramsSchema });
    middleware(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });
});
