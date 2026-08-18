import type { FastifyInstance } from 'fastify';
import type { DiscoveryProvider, DiscoveryRegistry } from '@axsd/adapters';
import { safeDiscover } from '@axsd/adapters';

type DiscoverySource = DiscoveryRegistry | DiscoveryProvider[];

export function registerDiscoveryRoute(app: FastifyInstance, source: DiscoverySource): void {
  app.post('/api/v1/discovery/run', async (request, reply) => {
    const controller = new AbortController();
    const actorId = request.principal?.id;
    if (!actorId) return reply.status(401).send({ error: { code: 'AUTH_ERR', message: 'Authentication required' } });
    const providers = Array.isArray(source) ? source : source.list();
    const data = [];
    for (const provider of providers) {
      if (controller.signal.aborted) break;
      data.push(...await safeDiscover(provider, { environment: 'local', actorId, signal: controller.signal }));
    }
    return reply.send({ data });
  });
}
