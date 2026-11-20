import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { mockPrisma, resetDb } from './testDb.js';

// Mock prisma db
vi.mock('../src/config/db.js', () => ({
  prisma: mockPrisma,
}));

const { default: app } = await import('../src/app.js');

describe('Leads API Endpoints', () => {
  let userACookie;
  let userBCookie;
  let userAId;
  let userBId;

  const validLead = {
    name: 'Michael Scott',
    email: 'mscott@dundermifflin.com',
    phone: '+1 570 555 0199',
    company: 'Dunder Mifflin Paper Co',
    source: 'WEBSITE',
    status: 'NEW',
    notes: 'Regional Manager looking for branch pipeline tracking.',
  };

  beforeEach(async () => {
    resetDb();
    vi.clearAllMocks();

    // Create User A
    const resA = await request(app).post('/api/v1/auth/signup').send({
      name: 'User A',
      email: 'usera@example.com',
      password: 'Password123',
    });
    userACookie = resA.headers['set-cookie'];
    userAId = resA.body.user.id;

    // Create User B
    const resB = await request(app).post('/api/v1/auth/signup').send({
      name: 'User B',
      email: 'userb@example.com',
      password: 'Password123',
    });
    userBCookie = resB.headers['set-cookie'];
    userBId = resB.body.user.id;
  });

  describe('POST /api/v1/leads', () => {
    it('should create a valid lead and return 201', async () => {
      const res = await request(app)
        .post('/api/v1/leads')
        .set('Cookie', userACookie)
        .send(validLead);

      expect(res.status).toBe(201);
      expect(res.body.lead).toHaveProperty('id');
      expect(res.body.lead.name).toBe(validLead.name);
      expect(res.body.lead.email).toBe(validLead.email);
      expect(res.body.lead.status).toBe('NEW');
    });

    it('should return 422 for invalid lead (missing required fields)', async () => {
      const res = await request(app)
        .post('/api/v1/leads')
        .set('Cookie', userACookie)
        .send({
          name: '',
          email: 'invalid-email',
          company: '',
        });

      expect(res.status).toBe(422);
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should return 409 when user attempts to add lead with duplicate email', async () => {
      await request(app)
        .post('/api/v1/leads')
        .set('Cookie', userACookie)
        .send(validLead);

      const res = await request(app)
        .post('/api/v1/leads')
        .set('Cookie', userACookie)
        .send(validLead);

      expect(res.status).toBe(409);
      expect(res.body.code).toBe('CONFLICT');
    });
  });

  describe('GET /api/v1/leads (Search, Filter, Sort, Pagination)', () => {
    beforeEach(async () => {
      // Create 3 leads for User A
      await request(app)
        .post('/api/v1/leads')
        .set('Cookie', userACookie)
        .send({ ...validLead, email: 'lead1@corp.com', name: 'Alice Smith', status: 'NEW', source: 'WEBSITE' });

      await request(app)
        .post('/api/v1/leads')
        .set('Cookie', userACookie)
        .send({ ...validLead, email: 'lead2@corp.com', name: 'Bob Jones', company: 'Acme Corp', status: 'QUALIFIED', source: 'REFERRAL' });

      await request(app)
        .post('/api/v1/leads')
        .set('Cookie', userACookie)
        .send({ ...validLead, email: 'lead3@corp.com', name: 'Charlie Day', status: 'LOST', source: 'LINKEDIN' });
    });

    it('should list leads with pagination metadata', async () => {
      const res = await request(app)
        .get('/api/v1/leads?page=1&limit=2')
        .set('Cookie', userACookie);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.meta).toEqual({
        total: 3,
        page: 1,
        limit: 2,
        totalPages: 2,
      });
    });

    it('should filter leads by status', async () => {
      const res = await request(app)
        .get('/api/v1/leads?status=QUALIFIED')
        .set('Cookie', userACookie);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].status).toBe('QUALIFIED');
    });

    it('should search leads by company or name', async () => {
      const res = await request(app)
        .get('/api/v1/leads?search=Acme')
        .set('Cookie', userACookie);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].company).toBe('Acme Corp');
    });
  });

  describe('PATCH /api/v1/leads/:id', () => {
    it('should update lead status successfully (status-only update)', async () => {
      const createRes = await request(app)
        .post('/api/v1/leads')
        .set('Cookie', userACookie)
        .send(validLead);

      const leadId = createRes.body.lead.id;

      const res = await request(app)
        .patch(`/api/v1/leads/${leadId}`)
        .set('Cookie', userACookie)
        .send({ status: 'QUALIFIED' });

      expect(res.status).toBe(200);
      expect(res.body.lead.status).toBe('QUALIFIED');
    });
  });

  describe('DELETE /api/v1/leads/:id', () => {
    it('should delete the lead and return 204', async () => {
      const createRes = await request(app)
        .post('/api/v1/leads')
        .set('Cookie', userACookie)
        .send(validLead);

      const leadId = createRes.body.lead.id;

      const deleteRes = await request(app)
        .delete(`/api/v1/leads/${leadId}`)
        .set('Cookie', userACookie);

      expect(deleteRes.status).toBe(204);

      // Verify lead is gone
      const getRes = await request(app)
        .get(`/api/v1/leads/${leadId}`)
        .set('Cookie', userACookie);

      expect(getRes.status).toBe(404);
    });
  });

  describe('Tenant Isolation: User A cannot read, update, or delete User B lead', () => {
    let userBLeadId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/leads')
        .set('Cookie', userBCookie)
        .send({
          ...validLead,
          email: 'userb-lead@private.com',
          name: 'Private Lead of B',
        });
      userBLeadId = res.body.lead.id;
    });

    it('User A cannot GET User B lead', async () => {
      const res = await request(app)
        .get(`/api/v1/leads/${userBLeadId}`)
        .set('Cookie', userACookie);

      expect(res.status).toBe(404);
      expect(res.body.code).toBe('NOT_FOUND');
    });

    it('User A cannot PATCH User B lead', async () => {
      const res = await request(app)
        .patch(`/api/v1/leads/${userBLeadId}`)
        .set('Cookie', userACookie)
        .send({ status: 'LOST' });

      expect(res.status).toBe(404);
    });

    it('User A cannot DELETE User B lead', async () => {
      const res = await request(app)
        .delete(`/api/v1/leads/${userBLeadId}`)
        .set('Cookie', userACookie);

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/v1/stats', () => {
    it('should return aggregated metrics for the authenticated user', async () => {
      await request(app)
        .post('/api/v1/leads')
        .set('Cookie', userACookie)
        .send(validLead);

      const res = await request(app)
        .get('/api/v1/stats')
        .set('Cookie', userACookie);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('byStatus');
      expect(res.body).toHaveProperty('bySource');
      expect(res.body).toHaveProperty('recent');
      expect(res.body.total).toBe(1);
      expect(res.body.byStatus.NEW).toBe(1);
    });
  });
});
