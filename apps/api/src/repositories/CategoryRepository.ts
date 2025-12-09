import { db } from '../database/index.js';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/index.js';
import { generateId } from '../utils/index.js';

export class CategoryRepository {
  private get collection() {
    return db.getCollection('categories');
  }

  create(dto: CreateCategoryDto): Category {
    const category: Category = {
      id: generateId(),
      name: dto.name,
      color: dto.color,
      icon: dto.icon,
    };
    this.collection.set(category.id, category);
    return category;
  }

  findById(id: string): Category | undefined {
    return this.collection.get(id);
  }

  findAll(): Category[] {
    return Array.from(this.collection.values());
  }

  update(id: string, dto: UpdateCategoryDto): Category | undefined {
    const existing = this.collection.get(id);
    if (!existing) return undefined;

    const updated: Category = {
      ...existing,
      ...dto,
    };
    this.collection.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.collection.delete(id);
  }
}
