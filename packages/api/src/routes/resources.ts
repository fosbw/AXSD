import type { FastifyInstance } from 'fastify';
import type { ResourceType } from '@axsd/core';
import type { ResourceRepository } from '@axsd/storage';

const RESOURCE_TYPES: readonly ResourceType[] = ['model','agent','tool','mcp','api','environment','container','git','cloud','plugin'];

export function registerResourceRoutes(app: FastifyInstance, repository: ResourceRepository): void {
  app.get<{ Querystring: { type?: ResourceType; provider?: string; status?: string; search?: string; page?: string; limit?: string } }>('/api/v1/resources', async (request) => {
    const all = await repository.list();
    const query = request.query;
    const search = query.search?.trim().toLowerCase();
    const filtered = all.filter((resource) =>
      (!query.type || resource.type === query.type) &&
      (!query.provider || resource.provider === query.provider) &&
      (!query.status || resource.status === query.status) &&
      (!search || `${resource.id} ${resource.name} ${resource.provider}`.toLowerCase().includes(search))
    );
    const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit ?? '50', 10) || 50));
    const start = (page - 1) * limit;
    return { data: filtered.slice(start, start + limit), meta: { page, limit, total: filtered.length } };
  });

  app.get<{ Params: { id: string } }>('/api/v1/resources/:id', async (request, reply) => {
    const resource = await repository.get(request.params.id);
    if (!resource) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Resource not found' } });
    return { data: resource };
  });

  app.post<{ Body: { id: string; name: string; type: ResourceType; provider: string; version?: string; capabilities?: string[]; status?: 'enabled' | 'disabled' | 'disconnected'; source?: string; adapter?: string; metadata?: Record<string, unknown> } }>('/api/v1/resources', async (request, reply) => {
    const { id, name, type, provider, version, capabilities = [], status = 'enabled', source = 'api', adapter = 'default', metadata = {} } = request.body;
    if (!id || !name || !provider || !RESOURCE_TYPES.includes(type) || !Array.isArray(capabilities) || !['enabled','disabled','disconnected'].includes(status)) {
      return reply.status(400).send({ error: { code: 'VALIDATION_ERR', message: 'Invalid resource definition' } });
    }
    const resource = { id, name, type, provider, version, capabilities, status, health: 'unknown', source, adapter, metadata };
    await repository.upsert(resource);
    return reply.status(201).send({ data: resource });
  });
}
