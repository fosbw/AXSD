import type { FastifyInstance } from 'fastify';
import { container } from '../container.js';

export function registerHealthRoutes(app: FastifyInstance): void {
  app.get('/api/v1/health', async () => ({ status: 'ok', service: 'axsd-api', version: '0.1.0' }));
  app.get('/api/v1/ready', async (_request, reply) => {
    if (!container.pool) return reply.status(503).send({ ready:false, checks:{database:'not-configured'} });
    try { await container.pool.query('SELECT 1'); return reply.send({ ready:true, checks:{database:'ok'} }); }
    catch { return reply.status(503).send({ ready:false, checks:{database:'fail'} }); }
  });
}
