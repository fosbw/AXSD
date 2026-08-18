import type { FastifyInstance } from 'fastify';
import { generateApiKey, hashApiKey } from '../api-key-auth.js';
import { PostgresApiKeyRepository, PostgresUserRepository } from '@axsd/storage';
import { createPool } from '@axsd/storage';

export function registerBootstrapRoute(app: FastifyInstance): void {
  app.post<{ Body: { email: string; displayName: string; bootstrapToken: string } }>('/api/v1/bootstrap/owner', async (request, reply) => {
    if (!process.env.BOOTSTRAP_TOKEN || request.body.bootstrapToken !== process.env.BOOTSTRAP_TOKEN) return reply.status(403).send({ error: { code: 'FORBIDDEN', message: 'Invalid bootstrap token' } });
    if (!process.env.DATABASE_URL) return reply.status(503).send({ error: { code: 'INTERNAL_ERR', message: 'Database required for bootstrap' } });
    const pool = createPool(); const users = new PostgresUserRepository(pool); const keys = new PostgresApiKeyRepository(pool); const user = { id: crypto.randomUUID(), email: request.body.email, displayName: request.body.displayName, role: 'OWNER' as const }; const key = generateApiKey();
    try { await users.create(user); await keys.create({ id: crypto.randomUUID(), userId: user.id, keyHash: hashApiKey(key), label: 'initial-owner', createdAt: new Date().toISOString() }); return reply.status(201).send({ data: { user, apiKey: key } }); } finally { await pool.end(); }
  });
}