import type { FastifyInstance } from 'fastify';
import { NoopAuthenticator, requireAuth } from './auth.js';

export function registerAuthHook(app: FastifyInstance): void {
  const authenticator = new NoopAuthenticator();
  app.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/api/v1/health') || request.url.startsWith('/api/v1/ready')) return;
    if (process.env.AUTH_DISABLED === 'true') return;
    await requireAuth(authenticator, request, reply);
  });
}