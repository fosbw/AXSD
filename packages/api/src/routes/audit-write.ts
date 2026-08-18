import type { FastifyInstance } from 'fastify';
import type { AuditRepository } from '@axsd/storage';
import { auditDigest } from '@axsd/storage';

export function registerAuditWriteRoute(app: FastifyInstance, repository: AuditRepository): void {
  app.post<{ Body: { actorId: string; action: string; resourceId?: string; risk: string; decision: string; metadata?: Record<string, unknown> } }>('/api/v1/audit/events', async (request, reply) => {
    const event = { id: crypto.randomUUID(), ...request.body, timestamp: new Date().toISOString(), metadata: request.body.metadata ?? {} };
    const digest = auditDigest(event);
    await repository.append({ ...event, metadata: { ...event.metadata, digest } });
    return reply.status(201).send({ data: { ...event, digest } });
  });
}