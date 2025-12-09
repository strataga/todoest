import { Router, type Router as RouterType } from 'express';
import todoRoutes from './todo.routes.js';
import categoryRoutes from './category.routes.js';

const router: RouterType = Router();

router.use('/todos', todoRoutes);
router.use('/categories', categoryRoutes);

export default router;
