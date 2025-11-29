import request from 'supertest';
import app from '../src/app';
import { initializeDatabase } from '../src/db/init';
import pool from '../src/db/pool';

const genEmail = () => `test+${Date.now()}_${Math.floor(Math.random()*10000)}@example.com`;

let authToken: string;
let createdUrlId: number;
let shortCode: string;

beforeAll(async () => {
  await initializeDatabase();
});

afterAll(async () => {
  await pool.end();
});

describe('Auth and URL flow', () => {
  it('signs up a new user', async () => {
    const email = genEmail();
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'tester', email, password: 'secret123' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('logs in existing user', async () => {
    const email = genEmail();
    // signup first
    await request(app)
      .post('/api/auth/signup')
      .send({ username: 'loginuser', email, password: 'secret123' });
    // login
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'secret123' });
    expect(res.status).toBe(200);
    authToken = res.body.token;
    expect(authToken).toBeDefined();
  });

  it('creates a short URL', async () => {
    const res = await request(app)
      .post('/api/urls/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ originalUrl: 'https://example.com', title: 'Example' });
    expect(res.status).toBe(201);
    expect(res.body.shortCode).toBeDefined();
    createdUrlId = res.body.id;
    shortCode = res.body.shortCode;
  });

  it('redirects via short code and tracks click', async () => {
    const res = await request(app)
      .get(`/${shortCode}`)
      .redirects(0); // do not follow
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('https://example.com');
  });

  it('returns analytics for created URL', async () => {
    const res = await request(app)
      .get(`/api/urls/${createdUrlId}/analytics`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.shortCode).toBe(shortCode);
    expect(res.body.totalClicks).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(res.body.recentClicks)).toBe(true);
  });
});
