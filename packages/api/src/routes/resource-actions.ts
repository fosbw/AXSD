import type { FastifyInstance } from 'fastify';
import type { ResourceRepository } from '@axsd/storage';

export function registerResourceActions(app: FastifyInstance, repository: ResourceRepository): void {
  app.post<{ Params: { id: string } }>('/api/v1/resources/:id/enable', async (request, reply) => {
    if (!request.principal?.id) return reply.status(401).send({ error: { code: 'AUTH_ERR', message: 'Authentication required' } });
    const resource = await repository.get(request.params.id);
    if (!resource) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Resource not found' } });
    if (resource.status === 'enabled') return { data: resource };
    const next = { ...resource, status: 'enabled' as const };
    await repository.upsert(next);
    return { data: next };
  });

  app.post<{ Params: { id: string } }>('/api/v1/resources/:id/disable', async (request, reply) => {
    if (!request.principal?.id) return reply.status(401).send({ error: { code: 'AUTH_ERR', message: 'Authentication required' } });
    const resource = await repository.get(request.params.id);
    if (!resource) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Resource not found' } });
    if (resource.status === 'disabled') return { data: resource };
    const next = { ...resource, status: 'disabled' as const };
    await repository.upsert(next);
    return { data: next };
  });

  app.delete<{ Params: { id: string } }>('/api/v1/resources/:id', async (request, reply) => {
    if (!request.principal?.id) return reply.status(401).send({ error: { code: 'AUTH_ERR', message: 'Authentication required' } });
    const resource = await repository.get(request.params.id);
    if (!resource) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Resource not found' } });
    if (resource.status === 'enabled') return reply.status(409).send({ error: { code: 'CONFLICT', message: 'Disable resource before removal' } });
    const removed = await repository.remove(request.params.id);
    if (!removed) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Resource not found' } });
    return reply.status(204).send();
  });
}
