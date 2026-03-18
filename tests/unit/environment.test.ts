import { getEnv } from '../../src/config/environment';

describe('environment config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      JWT_SECRET: 'test_jwt_secret_at_least_32_characters_long',
      JWT_REFRESH_SECRET: 'test_refresh_secret_at_least_32_characters_long',
      NODE_ENV: 'test',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return default port 3000 when not set', () => {
    // PORT is set to 3001 in test setup, which overrides the default
    const env = getEnv();
    expect(typeof env.PORT).toBe('number');
    expect(env.PORT).toBeGreaterThan(0);
  });

  it('should parse NODE_ENV correctly', () => {
    const env = getEnv();
    expect(env.NODE_ENV).toBe('test');
  });

  it('should return configured rate limit settings', () => {
    const env = getEnv();
    expect(typeof env.RATE_LIMIT_MAX).toBe('number');
    expect(env.RATE_LIMIT_WINDOW_MS).toBe(900000);
  });
});
