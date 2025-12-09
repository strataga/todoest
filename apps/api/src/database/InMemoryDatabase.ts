import type { Todo, Category } from '../types/index.js';

export interface DatabaseCollections {
  todos: Map<string, Todo>;
  categories: Map<string, Category>;
}

class InMemoryDatabase {
  private static instance: InMemoryDatabase;
  private collections: DatabaseCollections;

  private constructor() {
    this.collections = {
      todos: new Map<string, Todo>(),
      categories: new Map<string, Category>(),
    };
    this.seed();
  }

  static getInstance(): InMemoryDatabase {
    if (!InMemoryDatabase.instance) {
      InMemoryDatabase.instance = new InMemoryDatabase();
    }
    return InMemoryDatabase.instance;
  }

  getCollection<K extends keyof DatabaseCollections>(name: K): DatabaseCollections[K] {
    return this.collections[name];
  }

  reset(): void {
    this.collections.todos.clear();
    this.collections.categories.clear();
    this.seed();
  }

  private seed(): void {
    const now = new Date().toISOString();

    // Seed categories
    const categories: Category[] = [
      { id: 'cat-work', name: 'Work', color: 'hsl(152, 35%, 45%)' },
      { id: 'cat-personal', name: 'Personal', color: 'hsl(262, 52%, 55%)' },
      { id: 'cat-health', name: 'Health', color: 'hsl(340, 65%, 55%)' },
      { id: 'cat-learning', name: 'Learning', color: 'hsl(38, 92%, 50%)' },
    ];

    categories.forEach((cat) => {
      this.collections.categories.set(cat.id, cat);
    });

    // Seed todos
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const twoDays = new Date(today);
    twoDays.setDate(twoDays.getDate() + 2);
    const oneWeek = new Date(today);
    oneWeek.setDate(oneWeek.getDate() + 7);

    const todos: Todo[] = [
      {
        id: 'todo-1',
        title: 'Design new landing page',
        description: 'Create wireframes and mockups for the new marketing site',
        dueDate: twoDays.toISOString().split('T')[0],
        categoryId: 'cat-work',
        completed: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'todo-2',
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, vegetables',
        dueDate: tomorrow.toISOString().split('T')[0],
        categoryId: 'cat-personal',
        completed: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'todo-3',
        title: 'Review pull requests',
        description: 'Check team PRs and provide feedback',
        dueDate: today.toISOString().split('T')[0],
        categoryId: 'cat-work',
        completed: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'todo-4',
        title: 'Morning yoga session',
        description: '30 minutes of stretching and meditation',
        dueDate: null,
        categoryId: 'cat-health',
        completed: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'todo-5',
        title: "Read 'Atomic Habits'",
        description: 'Finish chapters 5-8',
        dueDate: oneWeek.toISOString().split('T')[0],
        categoryId: 'cat-learning',
        completed: false,
        createdAt: now,
        updatedAt: now,
      },
    ];

    todos.forEach((todo) => {
      this.collections.todos.set(todo.id, todo);
    });
  }
}

export const db = InMemoryDatabase.getInstance();
