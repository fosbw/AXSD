import Fastify, { type FastifyInstance } from 'fastify';
import { registerHealthRoutes } from './routes/health.js';
import { registerResourceRoutes } from './routes/resources.js';

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });
  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);
    return reply.status(500).send({ error: { code: 'INTERNAL_ERR', message: 'Internal server error' } });
  });
  registerHealthRoutes(app);
  registerResourceRoutes(app);
  return app;
}