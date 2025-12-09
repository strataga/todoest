export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  categoryId: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export type FilterStatus = 'all' | 'active' | 'completed';
export type SortBy = 'dueDate' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface TodoFilters {
  status: FilterStatus;
  categoryId: string | null;
  sortBy: SortBy;
  sortOrder: SortOrder;
}
