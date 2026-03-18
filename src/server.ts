import 'reflect-metadata';
import createApp from './app';
import { connectDatabase } from './config/database';
import getEnv from './config/environment';
import logger from './config/logger';

async function bootstrap(): Promise<void> {
  const env = getEnv();

  try {
    await connectDatabase();
    logger.info('Database connected successfully');

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      logger.info(`API docs available at http://localhost:${env.PORT}/api-docs`);
    });

    const gracefulShutdown = (signal: string): void => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
