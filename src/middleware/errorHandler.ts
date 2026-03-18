import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function createError(message: string, statusCode: number): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

export function notFound(req: Request, res: Response, next: NextFunction): void {
  const error = createError(`Route ${req.originalUrl} not found`, 404);
  next(error);
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const statusCode = err.statusCode ?? 500;
  const isProduction = process.env.NODE_ENV === 'production';

  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    statusCode,
  });

  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500 ? 'Internal server error' : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
