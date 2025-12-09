import type { Request, Response, NextFunction } from 'express';
import { TodoService } from '../services/index.js';
import type { CreateTodoDto, UpdateTodoDto } from '../types/index.js';

export class TodoController {
  constructor(private todoService: TodoService) {}

  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dto: CreateTodoDto = req.body;
      const todo = this.todoService.create(dto);
      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  };

  findAll = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const todos = this.todoService.findAll();
      res.json(todos);
    } catch (error) {
      next(error);
    }
  };

  findById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const todo = this.todoService.findById(req.params.id);
      res.json(todo);
    } catch (error) {
      next(error);
    }
  };

  update = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dto: UpdateTodoDto = req.body;
      const todo = this.todoService.update(req.params.id, dto);
      res.json(todo);
    } catch (error) {
      next(error);
    }
  };

  delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      this.todoService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  toggleComplete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const todo = this.todoService.toggleComplete(req.params.id);
      res.json(todo);
    } catch (error) {
      next(error);
    }
  };
}
