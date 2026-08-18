import type { FastifyInstance } from 'fastify';
import type { DiscoveryRegistry } from '@axsd/adapters';
import { safeDiscover } from '@axsd/adapters';

export function registerDiscoveryRoute(app: FastifyInstance, registry: DiscoveryRegistry): void {
  app.post('/api/v1/discovery/run', async (request, reply) => {
    const controller = new AbortController();
    const actorId = request.principal?.id;
    if (!actorId) return reply.status(401).send({ error: { code: 'AUTH_ERR', message: 'Authentication required' } });
    const data = [];
    for (const provider of registry.list()) {
      if (controller.signal.aborted) break;
      data.push(...await safeDiscover(provider, { environment: 'local', actorId, signal: controller.signal }));
    }
    return reply.send({ data });
  });
}
