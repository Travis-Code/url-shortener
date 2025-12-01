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
	// Clean up test data
	await pool.query('DELETE FROM clicks');
	await pool.query('DELETE FROM urls');
	await pool.query('DELETE FROM users');
});

afterAll(async () => {
	await pool.end();
});

describe('Auth and URL flow', () => {
	it('complete flow: signup, login, create URL, redirect, analytics', async () => {
		// 1. Sign up a new user
		const email = genEmail();
		const signupRes = await request(app)
			.post('/api/auth/signup')
			.send({ username: 'tester', email, password: 'secret123' });
		if (signupRes.status !== 201) {
			console.log('Signup failed:', signupRes.status, signupRes.body);
		}
		expect(signupRes.status).toBe(201);
		expect(signupRes.body.token).toBeDefined();

		// 2. Login with the created user
		const loginRes = await request(app)
			.post('/api/auth/login')
			.send({ email, password: 'secret123' });
		expect(loginRes.status).toBe(200);
		const token = loginRes.body.token;
		expect(token).toBeDefined();

		// 3. Create a short URL
		const createRes = await request(app)
			.post('/api/urls/create')
			.set('Authorization', `Bearer ${token}`)
			.send({ originalUrl: 'https://example.com', title: 'Example' });
		expect(createRes.status).toBe(201);
		expect(createRes.body.shortCode).toBeDefined();
		const urlId = createRes.body.id;
		const code = createRes.body.shortCode;

		// 4. Redirect via short code
		const redirectRes = await request(app)
			.get(`/${code}`)
			.redirects(0);
		expect(redirectRes.status).toBe(302);
		expect(redirectRes.headers.location).toBe('https://example.com');

		// 5. Get analytics
		const analyticsRes = await request(app)
			.get(`/api/urls/${urlId}/analytics`)
			.set('Authorization', `Bearer ${token}`);
		expect(analyticsRes.status).toBe(200);
		expect(analyticsRes.body.shortCode).toBe(code);
		expect(analyticsRes.body.totalClicks).toBeGreaterThanOrEqual(1);
		expect(Array.isArray(analyticsRes.body.recentClicks)).toBe(true);
	});
});
