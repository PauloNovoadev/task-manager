import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  res.json({
    message: 'rota protegida!',
    userId: req.userId
  });
});

export default router;