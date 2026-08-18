import type { FastifyInstance } from 'fastify';
import type { DiscoveryProvider } from '@axsd/adapters';
import { safeDiscover } from '@axsd/adapters';

export function registerDiscoveryRoute(app: FastifyInstance, providers: DiscoveryProvider[]): void {
  app.post('/api/v1/discovery/run', async (_request, reply) => {
    const controller = new AbortController();
    const results = [];
    for (const provider of providers) results.push(...await safeDiscover(provider, { environment: 'local', actorId: 'system', signal: controller.signal }));
    return reply.send({ data: results });
  });
}