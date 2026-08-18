import type { FastifyInstance } from 'fastify';
import type { Resource } from '@axsd/core';
import { rankCandidates } from '@axsd/core';
import type { ResourceRepository } from '@axsd/storage';

export function registerRoutingRoute(app: FastifyInstance, repository: ResourceRepository): void {
  app.post<{ Body: { intent: string; requiredCapabilities: string[]; allowedTypes?: Resource['type'][] } }>('/api/v1/routing/candidates', async request => {
    const records = await repository.list();
    const resources = records.map(r => ({ ...r, version: undefined, health: 'unknown' as const, source: 'registry', adapter: 'unknown', createdAt: '', updatedAt: '' }));
    return { data: rankCandidates(resources, request.body) };
  });
}