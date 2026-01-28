import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask
} from '../../controllers/task.controller.js';

const router = Router();

router.get('/', authMiddleware, listTasks);
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

export default router;