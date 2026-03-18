import request from 'supertest';
import createApp from '../../src/app';
import { Application } from 'express';

describe('Health Check', () => {
  let app: Application;

  beforeAll(() => {
    app = createApp();
  });

  it('GET /api/v1/health should return 200', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('API is running');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('GET /unknown should return 404', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
