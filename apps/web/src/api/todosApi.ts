import { axiosClient } from './axiosClient';
import type { Todo } from '@/types/todo';

export interface CreateTodoDto {
  title: string;
  description?: string;
  dueDate?: string | null;
  categoryId?: string | null;
  completed?: boolean;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  dueDate?: string | null;
  categoryId?: string | null;
  completed?: boolean;
}

export const todosApi = {
  getAll: async (): Promise<Todo[]> => {
    const response = await axiosClient.get<Todo[]>('/todos');
    return response.data;
  },

  getById: async (id: string): Promise<Todo> => {
    const response = await axiosClient.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  create: async (data: CreateTodoDto): Promise<Todo> => {
    const response = await axiosClient.post<Todo>('/todos', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTodoDto): Promise<Todo> => {
    const response = await axiosClient.patch<Todo>(`/todos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/todos/${id}`);
  },

  toggleComplete: async (id: string): Promise<Todo> => {
    const response = await axiosClient.patch<Todo>(`/todos/${id}/toggle`);
    return response.data;
  },
};
