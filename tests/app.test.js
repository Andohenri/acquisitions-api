import app from '#src/app.js';
import request from 'supertest';

describe('API endpoints', () => {
  describe('GET /', () => {
    it('should return 200 and welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello from Acquisitions API!');
    });
  });

  describe('GET /health', () => {
    it('should return 200 and health information', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'OK',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
      });
    });
  });

  describe('GET /api', () => {
    it('should return 200 and API status', async () => {
      const response = await request(app).get('/api');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Acquisitions API is running' });
    });
  });

  describe('GET /unknown-route', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'Endpoint not found',
      });
    });
  });
});
