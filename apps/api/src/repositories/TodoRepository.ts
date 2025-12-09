import { db } from '../database/index.js';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../types/index.js';
import { generateId } from '../utils/index.js';

export class TodoRepository {
  private get collection() {
    return db.getCollection('todos');
  }

  create(dto: CreateTodoDto): Todo {
    const now = new Date().toISOString();
    const todo: Todo = {
      id: generateId(),
      title: dto.title,
      description: dto.description ?? '',
      dueDate: dto.dueDate ?? null,
      categoryId: dto.categoryId ?? null,
      completed: dto.completed ?? false,
      createdAt: now,
      updatedAt: now,
    };
    this.collection.set(todo.id, todo);
    return todo;
  }

  findById(id: string): Todo | undefined {
    return this.collection.get(id);
  }

  findAll(): Todo[] {
    return Array.from(this.collection.values());
  }

  findByCategoryId(categoryId: string): Todo[] {
    return Array.from(this.collection.values()).filter((t) => t.categoryId === categoryId);
  }

  update(id: string, dto: UpdateTodoDto): Todo | undefined {
    const existing = this.collection.get(id);
    if (!existing) return undefined;

    const updated: Todo = {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    this.collection.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.collection.delete(id);
  }

  clearCategoryFromTodos(categoryId: string): void {
    for (const [id, todo] of this.collection.entries()) {
      if (todo.categoryId === categoryId) {
        this.collection.set(id, { ...todo, categoryId: null, updatedAt: new Date().toISOString() });
      }
    }
  }
}
