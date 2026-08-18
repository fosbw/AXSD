import Fastify, { type FastifyInstance } from 'fastify';
import { container } from './container.js';
import { registerAuthHook } from './auth-hook.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerBootstrapRoute } from './routes/bootstrap.js';
import { registerUserRoutes } from './routes/users.js';
import { registerResourceRoutes } from './routes/resources.js';
import { registerResourceActions } from './routes/resource-actions.js';
import { registerRoutingRoute } from './routes/routing.js';
import { registerAuditRoutes } from './routes/audit.js';
import { registerAuditWriteRoute } from './routes/audit-write.js';
import { registerDiscoveryRoute } from './routes/discovery.js';
import { registerDomainRoutes } from './routes/index.js';
import { registerOpenApiRoute } from './routes/openapi.js';
import { registerExecutionControlRoutes } from './routes/executions-control.js';
import { registerRateLimit } from './rate-limit.js';

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });
  app.setErrorHandler((error, _request, reply) => { app.log.error(error); return reply.status(500).send({ error: { code: 'INTERNAL_ERR', message: 'Internal server error' } }); });
  registerRateLimit(app); registerAuthHook(app); registerHealthRoutes(app); registerBootstrapRoute(app); registerUserRoutes(app, container.users);
  registerResourceRoutes(app, container.resources); registerResourceActions(app, container.resources); registerRoutingRoute(app, container.resources);
  registerAuditRoutes(app, container.audit); registerAuditWriteRoute(app, container.audit); registerDiscoveryRoute(app, []);
  registerOpenApiRoute(app); registerExecutionControlRoutes(app); registerDomainRoutes(app);
  return app;
}