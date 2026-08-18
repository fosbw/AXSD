import type { FastifyInstance } from 'fastify';
import type { ResourceType } from '@axsd/core';

const resources: Array<{ id: string; name: string; type: ResourceType; status: 'enabled' | 'disabled' | 'disconnected'; capabilities: string[] }> = [];

export function registerResourceRoutes(app: FastifyInstance): void {
  app.get('/api/v1/resources', async () => ({ data: resources, total: resources.length }));

  app.get<{ Params: { id: string } }>('/api/v1/resources/:id', async (request, reply) => {
    const resource = resources.find((item) => item.id === request.params.id);
    if (!resource) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Resource not found' } });
    return { data: resource };
  });
}