import type { FastifyInstance } from 'fastify';

export function registerHealthRoutes(app: FastifyInstance): void {
  app.get('/api/v1/health', async () => ({ status: 'ok', service: 'axsd-api', version: '0.1.0' }));
  app.get('/api/v1/ready', async (_request, reply) => reply.send({ ready: true }));
}