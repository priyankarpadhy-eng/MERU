import { vi } from 'vitest';
import crypto from 'crypto';

let users = [];
let leads = [];

export const resetDb = () => {
  users = [];
  leads = [];
};

export const mockPrisma = {
  user: {
    findUnique: vi.fn(async ({ where }) => {
      if (where.email) {
        return users.find((u) => u.email.toLowerCase() === where.email.toLowerCase()) || null;
      }
      if (where.id) {
        return users.find((u) => u.id === where.id) || null;
      }
      return null;
    }),
    create: vi.fn(async ({ data, select }) => {
      const newUser = {
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(newUser);

      if (select) {
        const res = {};
        Object.keys(select).forEach((k) => {
          if (select[k]) res[k] = newUser[k];
        });
        return res;
      }
      return newUser;
    }),
  },

  lead: {
    create: vi.fn(async ({ data }) => {
      const newLead = {
        id: crypto.randomUUID(),
        userId: data.userId,
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        company: data.company,
        source: data.source,
        status: data.status || 'NEW',
        notes: data.notes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      leads.push(newLead);
      return newLead;
    }),

    findFirst: vi.fn(async ({ where }) => {
      return (
        leads.find((l) => {
          if (where.userId && l.userId !== where.userId) return false;
          if (where.id && l.id !== where.id) return false;
          if (where.email && l.email.toLowerCase() !== where.email.toLowerCase()) return false;
          if (where.NOT && where.NOT.id && l.id === where.NOT.id) return false;
          return true;
        }) || null
      );
    }),

    count: vi.fn(async ({ where = {} }) => {
      const filtered = leads.filter((l) => {
        if (where.userId && l.userId !== where.userId) return false;
        if (where.status) {
          if (typeof where.status === 'string' && l.status !== where.status) return false;
          if (where.status.in && !where.status.in.includes(l.status)) return false;
        }
        if (where.source) {
          if (typeof where.source === 'string' && l.source !== where.source) return false;
          if (where.source.in && !where.source.in.includes(l.source)) return false;
        }
        if (where.OR) {
          const matches = where.OR.some((clause) => {
            if (clause.name?.contains) {
              return l.name.toLowerCase().includes(clause.name.contains.toLowerCase());
            }
            if (clause.email?.contains) {
              return l.email.toLowerCase().includes(clause.email.contains.toLowerCase());
            }
            if (clause.company?.contains) {
              return l.company.toLowerCase().includes(clause.company.contains.toLowerCase());
            }
            return false;
          });
          if (!matches) return false;
        }
        return true;
      });
      return filtered.length;
    }),

    findMany: vi.fn(async ({ where = {}, skip = 0, take = 10, orderBy }) => {
      let filtered = leads.filter((l) => {
        if (where.userId && l.userId !== where.userId) return false;
        if (where.status) {
          if (typeof where.status === 'string' && l.status !== where.status) return false;
          if (where.status.in && !where.status.in.includes(l.status)) return false;
        }
        if (where.source) {
          if (typeof where.source === 'string' && l.source !== where.source) return false;
          if (where.source.in && !where.source.in.includes(l.source)) return false;
        }
        if (where.OR) {
          const matches = where.OR.some((clause) => {
            if (clause.name?.contains) {
              return l.name.toLowerCase().includes(clause.name.contains.toLowerCase());
            }
            if (clause.email?.contains) {
              return l.email.toLowerCase().includes(clause.email.contains.toLowerCase());
            }
            if (clause.company?.contains) {
              return l.company.toLowerCase().includes(clause.company.contains.toLowerCase());
            }
            return false;
          });
          if (!matches) return false;
        }
        return true;
      });

      if (orderBy) {
        const field = Object.keys(orderBy)[0];
        const dir = orderBy[field] === 'desc' ? -1 : 1;
        filtered.sort((a, b) => {
          if (a[field] < b[field]) return -1 * dir;
          if (a[field] > b[field]) return 1 * dir;
          return 0;
        });
      }

      return filtered.slice(skip, skip + take);
    }),

    update: vi.fn(async ({ where, data }) => {
      const index = leads.findIndex((l) => l.id === where.id);
      if (index === -1) {
        const err = new Error('Record not found');
        err.code = 'P2025';
        throw err;
      }
      leads[index] = {
        ...leads[index],
        ...data,
        updatedAt: new Date(),
      };
      return leads[index];
    }),

    delete: vi.fn(async ({ where }) => {
      const index = leads.findIndex((l) => l.id === where.id);
      if (index === -1) {
        const err = new Error('Record not found');
        err.code = 'P2025';
        throw err;
      }
      const deleted = leads.splice(index, 1)[0];
      return deleted;
    }),

    groupBy: vi.fn(async ({ by, where }) => {
      const key = by[0];
      const counts = {};
      leads
        .filter((l) => !where?.userId || l.userId === where.userId)
        .forEach((l) => {
          const val = l[key];
          counts[val] = (counts[val] || 0) + 1;
        });
      return Object.entries(counts).map(([val, count]) => ({
        [key]: val,
        _count: { _all: count },
      }));
    }),

    deleteMany: vi.fn(async ({ where }) => {
      const count = leads.length;
      leads = leads.filter((l) => where?.userId && l.userId !== where.userId);
      return { count: count - leads.length };
    }),
  },

  $disconnect: vi.fn(async () => {}),
};
