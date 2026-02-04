import express from 'express';
import 'dotenv/config';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import router from './routes/tasks/task.routes.js';
import cors from "cors";


const app = express();

app.use(cors({
  origin: "*",
}));


app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Task Manager API",
    status: "running",
    health: "/health",
  });
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/tasks', router);

export default app;