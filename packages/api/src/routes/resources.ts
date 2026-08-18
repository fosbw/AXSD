import type { FastifyInstance } from 'fastify';
import type { ResourceType } from '@axsd/core';
import type { ResourceRepository } from '@axsd/storage';

export function registerResourceRoutes(app: FastifyInstance, repository: ResourceRepository): void {
  app.get('/api/v1/resources', async () => ({ data: await repository.list() }));

  app.get<{ Params: { id: string } }>('/api/v1/resources/:id', async (request, reply) => {
    const resource = await repository.get(request.params.id);
    if (!resource) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Resource not found' } });
    return { data: resource };
  });

  app.post<{ Body: { id: string; name: string; type: ResourceType; provider: string; capabilities?: string[] } }>('/api/v1/resources', async (request, reply) => {
    const { id, name, type, provider, capabilities = [] } = request.body;
    if (!id || !name || !type || !provider) return reply.status(400).send({ error: { code: 'VALIDATION_ERR', message: 'id, name, type and provider are required' } });
    const resource = { id, name, type, provider, capabilities, status: 'enabled', metadata: {} };
    await repository.upsert(resource);
    return reply.status(201).send({ data: resource });
  });
}