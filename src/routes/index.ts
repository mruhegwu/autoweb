import { Router, Request, Response } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import getEnv from '../config/environment';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export function mountRoutes(app: Router): void {
  const env = getEnv();
  const prefix = `/api/${env.API_VERSION}`;

  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/users`, userRoutes);
  app.use(`${prefix}`, router);
}

export default router;
