import { CategoryRepository } from '../repositories/index.js';
import { TodoRepository } from '../repositories/index.js';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/index.js';
import { ApiError } from '../utils/index.js';

export class CategoryService {
  constructor(
    private categoryRepo: CategoryRepository,
    private todoRepo: TodoRepository
  ) {}

  create(dto: CreateCategoryDto): Category {
    return this.categoryRepo.create(dto);
  }

  findById(id: string): Category {
    const category = this.categoryRepo.findById(id);
    if (!category) {
      throw ApiError.notFound('Category');
    }
    return category;
  }

  findAll(): Category[] {
    return this.categoryRepo.findAll();
  }

  update(id: string, dto: UpdateCategoryDto): Category {
    const category = this.categoryRepo.update(id, dto);
    if (!category) {
      throw ApiError.notFound('Category');
    }
    return category;
  }

  delete(id: string): void {
    const category = this.categoryRepo.findById(id);
    if (!category) {
      throw ApiError.notFound('Category');
    }
    // Clear category reference from todos
    this.todoRepo.clearCategoryFromTodos(id);
    this.categoryRepo.delete(id);
  }
}
