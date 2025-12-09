import type { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/index.js';
import type { CreateCategoryDto, UpdateCategoryDto } from '../types/index.js';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dto: CreateCategoryDto = req.body;
      const category = this.categoryService.create(dto);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  };

  findAll = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const categories = this.categoryService.findAll();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };

  findById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const category = this.categoryService.findById(req.params.id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  update = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dto: UpdateCategoryDto = req.body;
      const category = this.categoryService.update(req.params.id, dto);
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      this.categoryService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
