import { axiosClient } from './axiosClient';
import type { Category } from '@/types/todo';

export interface CreateCategoryDto {
  name: string;
  color: string;
  icon?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  color?: string;
  icon?: string;
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await axiosClient.get<Category[]>('/categories');
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await axiosClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await axiosClient.post<Category>('/categories', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryDto): Promise<Category> => {
    const response = await axiosClient.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/categories/${id}`);
  },
};
