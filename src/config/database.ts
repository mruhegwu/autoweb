import { DataSource, DataSourceOptions } from 'typeorm';
import getEnv from './environment';
import { User } from '../models/User';

export function getDatabaseConfig(): DataSourceOptions {
  const env = getEnv();
  const isTest = env.NODE_ENV === 'test';

  return {
    type: 'postgres',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: isTest ? `${env.DB_NAME}_test` : env.DB_NAME,
    ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
    entities: [User],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: env.NODE_ENV === 'development',
    logging: env.NODE_ENV === 'development',
    poolSize: env.DB_POOL_SIZE,
  };
}

export const AppDataSource = new DataSource(getDatabaseConfig());

export async function connectDatabase(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}

export async function closeDatabase(): Promise<void> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}
