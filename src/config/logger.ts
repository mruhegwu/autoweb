import winston from 'winston';
import getEnv from './environment';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack }) => {
    return stack
      ? `${ts} [${level}]: ${message}\n${stack}`
      : `${ts} [${level}]: ${message}`;
  }),
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json(),
);

function createLogger(): winston.Logger {
  const env = getEnv();
  const isProduction = env.NODE_ENV === 'production';

  return winston.createLogger({
    level: env.LOG_LEVEL,
    format: isProduction || env.LOG_FORMAT === 'json' ? prodFormat : devFormat,
    defaultMeta: { service: 'autoweb' },
    transports: [
      new winston.transports.Console(),
    ],
    exceptionHandlers: [
      new winston.transports.Console(),
    ],
    rejectionHandlers: [
      new winston.transports.Console(),
    ],
  });
}

const logger = createLogger();

export default logger;
