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
