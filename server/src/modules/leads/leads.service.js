import { prisma } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import { STATUSES, SOURCES } from './leads.schema.js';

export const leadsService = {
  async createLead(userId, data) {
    const existing = await prisma.lead.findFirst({
      where: {
        userId,
        email: data.email,
      },
    });

    if (existing) {
      throw ApiError.conflict('A lead with this email already exists', [
        { field: 'email', message: 'You have already added a lead with this email' },
      ]);
    }

    const lead = await prisma.lead.create({
      data: {
        ...data,
        userId,
      },
    });

    return lead;
  },

  async getLeads(userId, query) {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 10, 50);
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || 'createdAt';
    const order = query.order === 'asc' ? 'asc' : 'desc';

    const where = { userId };

    // Search query matches name, email, or company (case-insensitive)
    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { email: { contains: term, mode: 'insensitive' } },
        { company: { contains: term, mode: 'insensitive' } },
      ];
    }

    // Status filter (single or comma-separated)
    if (query.status && query.status.trim()) {
      const statusList = query.status
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter((s) => STATUSES.includes(s));

      if (statusList.length === 1) {
        where.status = statusList[0];
      } else if (statusList.length > 1) {
        where.status = { in: statusList };
      }
    }

    // Source filter (single or comma-separated)
    if (query.source && query.source.trim()) {
      const sourceList = query.source
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter((s) => SOURCES.includes(s));

      if (sourceList.length === 1) {
        where.source = sourceList[0];
      } else if (sourceList.length > 1) {
        where.source = { in: sourceList };
      }
    }

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: order,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: leads,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  },

  async getLeadById(userId, id) {
    const lead = await prisma.lead.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!lead) {
      throw ApiError.notFound('Lead not found');
    }

    return lead;
  },

  async updateLead(userId, id, data) {
    const existing = await prisma.lead.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      throw ApiError.notFound('Lead not found');
    }

    // Check duplicate email if email is changed
    if (data.email && data.email !== existing.email) {
      const duplicate = await prisma.lead.findFirst({
        where: {
          userId,
          email: data.email,
          NOT: { id },
        },
      });

      if (duplicate) {
        throw ApiError.conflict('A lead with this email already exists', [
          { field: 'email', message: 'You have already added another lead with this email' },
        ]);
      }
    }

    const updated = await prisma.lead.update({
      where: { id },
      data,
    });

    return updated;
  },

  async deleteLead(userId, id) {
    const existing = await prisma.lead.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      throw ApiError.notFound('Lead not found');
    }

    await prisma.lead.delete({
      where: { id },
    });
  },
};
