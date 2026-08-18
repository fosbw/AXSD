import type { FastifyInstance } from 'fastify';
import type { AuditRepository } from '@axsd/storage';

export function registerAuditRoutes(app: FastifyInstance, audit: AuditRepository): void {
  app.get<{ Querystring: { limit?: number } }>('/api/v1/audit', async (request) => {
    const limit = Math.min(Math.max(Number(request.query.limit ?? 100), 1), 500);
    return { data: await audit.list(limit), limit };
  });
}