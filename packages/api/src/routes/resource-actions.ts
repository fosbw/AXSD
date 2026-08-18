import type { FastifyInstance } from 'fastify';
import type { ResourceRepository } from '@axsd/storage';

export function registerResourceActions(app: FastifyInstance, repository: ResourceRepository): void {
  app.delete<{ Params: { id: string } }>('/api/v1/resources/:id', async (request, reply) => { const removed = await repository.remove(request.params.id); if (!removed) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Resource not found' } }); return reply.status(204).send(); });
}