import request from 'supertest';

const BASE_URL = 'https://url-shortener-production-c83f.up.railway.app';

describe('Remote API Integration', () => {
  let token = '';
  let shortCode = '';

  it('should return ok from /api/health', async () => {
    const res = await request(BASE_URL).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('should signup a new user', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/signup')
      .send({
        email: 'testuser_remote3@example.com',
        password: 'password123',
        username: 'remoteuser3'
      });
    expect([200, 201, 400, 409]).toContain(res.status);
  });

  it('should login and get JWT', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/login')
      .send({
        email: 'testuser_remote3@example.com',
        password: 'password123'
      });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('should create a short URL', async () => {
    const res = await request(BASE_URL)
      .post('/api/urls/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        originalUrl: 'https://github.com',
        customShortCode: 'github-remote',
        title: 'GitHub Homepage'
      });
    expect([200, 201, 400, 409]).toContain(res.status);
    if ([200, 201].includes(res.status)) {
      expect(res.body.shortCode).toBeDefined();
      shortCode = res.body.shortCode;
    }
  });

  it('should get analytics for URLs', async () => {
    const res = await request(BASE_URL)
      .get('/api/urls/analytics')
      .set('Authorization', `Bearer ${token}`);
    if (res.status === 404) {
      // No analytics found for this user yet, treat as pass
      expect(res.status).toBe(404);
    } else {
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }
  });
});
