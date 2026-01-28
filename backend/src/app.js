import express from 'express';
import 'dotenv/config';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import router from './routes/tasks/task.routes.js';



const app = express();

// middleware global para JSON
app.use(express.json());

// rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// rotas da aplicação
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/tasks', router);

export default app;