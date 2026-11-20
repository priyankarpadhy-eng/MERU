import { prisma } from '../../config/db.js';
import { STATUSES, SOURCES } from '../leads/leads.schema.js';

export const statsService = {
  async getStats(userId) {
    // 1. Total leads count
    const total = await prisma.lead.count({
      where: { userId },
    });

    // 2. Count grouped by status
    const statusGroups = await prisma.lead.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        _all: true,
      },
    });

    // Initialize all statuses with 0
    const byStatus = STATUSES.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    statusGroups.forEach((group) => {
      byStatus[group.status] = group._count._all;
    });

    // 3. Count grouped by source
    const sourceGroups = await prisma.lead.groupBy({
      by: ['source'],
      where: { userId },
      _count: {
        _all: true,
      },
    });

    // Initialize all sources with 0
    const bySource = SOURCES.reduce((acc, source) => {
      acc[source] = 0;
      return acc;
    }, {});

    sourceGroups.forEach((group) => {
      bySource[group.source] = group._count._all;
    });

    // 4. Last 5 recent leads
    const recent = await prisma.lead.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        phone: true,
        source: true,
        status: true,
        createdAt: true,
      },
    });

    return {
      total,
      byStatus,
      bySource,
      recent,
    };
  },
};
