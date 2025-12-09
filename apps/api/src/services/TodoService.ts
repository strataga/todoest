import { TodoRepository } from '../repositories/index.js';
import { CategoryRepository } from '../repositories/index.js';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../types/index.js';
import { ApiError } from '../utils/index.js';

export class TodoService {
  constructor(
    private todoRepo: TodoRepository,
    private categoryRepo: CategoryRepository
  ) {}

  create(dto: CreateTodoDto): Todo {
    // Validate category exists if provided
    if (dto.categoryId) {
      const category = this.categoryRepo.findById(dto.categoryId);
      if (!category) {
        throw ApiError.badRequest('Category not found');
      }
    }
    return this.todoRepo.create(dto);
  }

  findById(id: string): Todo {
    const todo = this.todoRepo.findById(id);
    if (!todo) {
      throw ApiError.notFound('Todo');
    }
    return todo;
  }

  findAll(): Todo[] {
    return this.todoRepo.findAll();
  }

  update(id: string, dto: UpdateTodoDto): Todo {
    // Validate category exists if being updated
    if (dto.categoryId) {
      const category = this.categoryRepo.findById(dto.categoryId);
      if (!category) {
        throw ApiError.badRequest('Category not found');
      }
    }

    const todo = this.todoRepo.update(id, dto);
    if (!todo) {
      throw ApiError.notFound('Todo');
    }
    return todo;
  }

  delete(id: string): void {
    const todo = this.todoRepo.findById(id);
    if (!todo) {
      throw ApiError.notFound('Todo');
    }
    this.todoRepo.delete(id);
  }

  toggleComplete(id: string): Todo {
    const todo = this.todoRepo.findById(id);
    if (!todo) {
      throw ApiError.notFound('Todo');
    }
    return this.todoRepo.update(id, { completed: !todo.completed })!;
  }
}
