import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { mockPrisma, resetDb } from './testDb.js';

// Mock prisma db
vi.mock('../src/config/db.js', () => ({
  prisma: mockPrisma,
}));

// Import app after mocking
const { default: app } = await import('../src/app.js');

describe('Auth API Endpoints', () => {
  beforeEach(() => {
    resetDb();
    vi.clearAllMocks();
  });

  const validUser = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'Password123',
  };

  describe('POST /api/v1/auth/signup', () => {
    it('should register a new user, return 201, and set httpOnly cookie', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.name).toBe(validUser.name);
      expect(res.body.user.email).toBe(validUser.email);
      expect(res.body.user).not.toHaveProperty('passwordHash');

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some((c) => c.includes('token='))).toBe(true);
      expect(cookies.some((c) => c.toLowerCase().includes('httponly'))).toBe(true);
    });

    it('should return 409 conflict when registering with duplicate email', async () => {
      await request(app).post('/api/v1/auth/signup').send(validUser);

      const res = await request(app).post('/api/v1/auth/signup').send(validUser);

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message');
      expect(res.body.code).toBe('CONFLICT');
    });

    it('should return 422 if password does not meet requirements', async () => {
      const res = await request(app).post('/api/v1/auth/signup').send({
        name: 'Jane Doe',
        email: 'jane2@example.com',
        password: 'weak',
      });

      expect(res.status).toBe(422);
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/v1/auth/signup').send(validUser);
    });

    it('should login successfully with correct credentials and set cookie', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: validUser.email,
        password: validUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(validUser.email);

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some((c) => c.includes('token='))).toBe(true);
    });

    it('should return 401 with wrong password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: validUser.email,
        password: 'WrongPassword999',
      });

      expect(res.status).toBe(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    it('should return 401 with nonexistent user email', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'nobody@example.com',
        password: 'Password123',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('Protected Route Authentication Check', () => {
    it('should return 401 when accessing protected route without cookie or token', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    it('should return 200 with current user data when authenticated via cookie', async () => {
      const signupRes = await request(app).post('/api/v1/auth/signup').send(validUser);
      const cookie = signupRes.headers['set-cookie'];

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', cookie);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(validUser.email);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should clear the auth token cookie and return 204', async () => {
      const signupRes = await request(app).post('/api/v1/auth/signup').send(validUser);
      const cookie = signupRes.headers['set-cookie'];

      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', cookie);

      expect(res.status).toBe(204);
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
    });
  });
});
