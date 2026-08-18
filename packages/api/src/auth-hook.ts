import type { FastifyInstance } from 'fastify';
import { NoopAuthenticator, requireAuth, type Authenticator } from './auth.js';
import { DatabaseAuthenticator } from './database-authenticator.js';
import { PostgresApiKeyRepository, PostgresUserRepository, createPool } from '@axsd/storage';

export function registerAuthHook(app: FastifyInstance): void {
  let authenticator: Authenticator = new NoopAuthenticator();
  if (process.env.DATABASE_URL) { const pool=createPool(); authenticator=new DatabaseAuthenticator(new PostgresApiKeyRepository(pool),new PostgresUserRepository(pool)); }
  app.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/api/v1/health') || request.url.startsWith('/api/v1/ready') || request.url.startsWith('/api/v1/bootstrap/owner')) return;
    if (process.env.AUTH_DISABLED === 'true' && process.env.NODE_ENV !== 'production') return;
    await requireAuth(authenticator, request, reply);
  });
}
