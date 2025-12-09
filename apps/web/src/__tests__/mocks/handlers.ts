import { http, HttpResponse } from 'msw';
import type { Todo, Category } from '@/types/todo';

const API_BASE = 'http://localhost:3000/api';

// Mock data
export const mockCategories: Category[] = [
  { id: 'cat-work', name: 'Work', color: 'hsl(152, 35%, 45%)' },
  { id: 'cat-personal', name: 'Personal', color: 'hsl(262, 52%, 55%)' },
  { id: 'cat-health', name: 'Health', color: 'hsl(340, 65%, 55%)' },
];

export const mockTodos: Todo[] = [
  {
    id: 'todo-1',
    title: 'Test Todo 1',
    description: 'Description 1',
    dueDate: '2025-12-31',
    categoryId: 'cat-work',
    completed: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'todo-2',
    title: 'Test Todo 2',
    description: 'Description 2',
    dueDate: null,
    categoryId: 'cat-personal',
    completed: true,
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
  {
    id: 'todo-3',
    title: 'Test Todo 3',
    description: '',
    dueDate: '2025-06-15',
    categoryId: null,
    completed: false,
    createdAt: '2025-01-03T00:00:00.000Z',
    updatedAt: '2025-01-03T00:00:00.000Z',
  },
];

// Mutable copy for CRUD operations
let todos = [...mockTodos];
let categories = [...mockCategories];

export const resetMockData = () => {
  todos = [...mockTodos];
  categories = [...mockCategories];
};

export const handlers = [
  // Todos
  http.get(`${API_BASE}/todos`, () => {
    return HttpResponse.json(todos);
  }),

  http.post(`${API_BASE}/todos`, async ({ request }) => {
    const body = (await request.json()) as Partial<Todo>;
    const newTodo: Todo = {
      id: `todo-${Date.now()}`,
      title: body.title || '',
      description: body.description || '',
      dueDate: body.dueDate || null,
      categoryId: body.categoryId || null,
      completed: body.completed || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    todos.push(newTodo);
    return HttpResponse.json(newTodo, { status: 201 });
  }),

  http.get(`${API_BASE}/todos/:id`, ({ params }) => {
    const todo = todos.find((t) => t.id === params.id);
    if (!todo) {
      return HttpResponse.json(
        { success: false, error: { message: 'Todo not found', code: 'NOT_FOUND' } },
        { status: 404 }
      );
    }
    return HttpResponse.json(todo);
  }),

  http.patch(`${API_BASE}/todos/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<Todo>;
    const index = todos.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { success: false, error: { message: 'Todo not found', code: 'NOT_FOUND' } },
        { status: 404 }
      );
    }
    todos[index] = { ...todos[index], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json(todos[index]);
  }),

  http.delete(`${API_BASE}/todos/:id`, ({ params }) => {
    const index = todos.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { success: false, error: { message: 'Todo not found', code: 'NOT_FOUND' } },
        { status: 404 }
      );
    }
    todos.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(`${API_BASE}/todos/:id/toggle`, ({ params }) => {
    const index = todos.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { success: false, error: { message: 'Todo not found', code: 'NOT_FOUND' } },
        { status: 404 }
      );
    }
    todos[index] = {
      ...todos[index],
      completed: !todos[index].completed,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(todos[index]);
  }),

  // Categories
  http.get(`${API_BASE}/categories`, () => {
    return HttpResponse.json(categories);
  }),

  http.post(`${API_BASE}/categories`, async ({ request }) => {
    const body = (await request.json()) as Partial<Category>;
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: body.name || '',
      color: body.color || 'hsl(0, 0%, 50%)',
      icon: body.icon,
    };
    categories.push(newCategory);
    return HttpResponse.json(newCategory, { status: 201 });
  }),

  http.get(`${API_BASE}/categories/:id`, ({ params }) => {
    const category = categories.find((c) => c.id === params.id);
    if (!category) {
      return HttpResponse.json(
        { success: false, error: { message: 'Category not found', code: 'NOT_FOUND' } },
        { status: 404 }
      );
    }
    return HttpResponse.json(category);
  }),

  http.patch(`${API_BASE}/categories/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<Category>;
    const index = categories.findIndex((c) => c.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { success: false, error: { message: 'Category not found', code: 'NOT_FOUND' } },
        { status: 404 }
      );
    }
    categories[index] = { ...categories[index], ...body };
    return HttpResponse.json(categories[index]);
  }),

  http.delete(`${API_BASE}/categories/:id`, ({ params }) => {
    const index = categories.findIndex((c) => c.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { success: false, error: { message: 'Category not found', code: 'NOT_FOUND' } },
        { status: 404 }
      );
    }
    categories.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
