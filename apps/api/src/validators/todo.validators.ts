import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional().default(''),
  dueDate: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  completed: z.boolean().optional().default(false),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  dueDate: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  completed: z.boolean().optional(),
});

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});
