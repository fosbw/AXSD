import type { FastifyInstance } from 'fastify';
import { requireAuth, NoopAuthenticator } from './auth.js';
import { DatabaseAuthenticator } from './database-authenticator.js';
import { PostgresApiKeyRepository, PostgresUserRepository, createPool } from '@axsd/storage';

export function registerAuthHook(app: FastifyInstance): void {
  const pool = process.env.DATABASE_URL ? createPool() : null;
  const authenticator = pool ? new DatabaseAuthenticator(new PostgresApiKeyRepository(pool), new PostgresUserRepository(pool)) : new NoopAuthenticator();
  app.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/api/v1/health') || request.url.startsWith('/api/v1/ready') || request.url.startsWith('/api/v1/bootstrap/owner')) return;
    if (process.env.AUTH_DISABLED === 'true') return;
    await requireAuth(authenticator, request, reply);
  });
}