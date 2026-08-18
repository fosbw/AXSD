import type { FastifyInstance } from 'fastify';
import { timingSafeEqual } from 'node:crypto';
import { generateApiKey, hashApiKey } from '../api-key-auth.js';
import { PostgresApiKeyRepository, PostgresUserRepository, createPool } from '@axsd/storage';

function constantTimeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function registerBootstrapRoute(app: FastifyInstance): void {
  app.post<{ Body: { email: string; displayName: string; bootstrapToken: string } }>('/api/v1/bootstrap/owner', async (request, reply) => {
    const configured = process.env.BOOTSTRAP_TOKEN;
    if (!configured || configured.length < 24 || !constantTimeEqual(request.body.bootstrapToken ?? '', configured)) {
      return reply.status(403).send({ error: { code: 'FORBIDDEN', message: 'Invalid bootstrap token' } });
    }
    if (!process.env.DATABASE_URL) return reply.status(503).send({ error: { code: 'INTERNAL_ERR', message: 'Database required for bootstrap' } });
    const email = request.body.email?.trim().toLowerCase();
    const displayName = request.body.displayName?.trim();
    if (!email || !email.includes('@') || !displayName || displayName.length > 200) {
      return reply.status(400).send({ error: { code: 'VALIDATION_ERR', message: 'Invalid owner details' } });
    }
    const pool = createPool(); const users = new PostgresUserRepository(pool); const keys = new PostgresApiKeyRepository(pool);
    try {
      if (await users.count() > 0) return reply.status(409).send({ error: { code: 'CONFLICT', message: 'Bootstrap already completed' } });
      const user = { id: crypto.randomUUID(), email, displayName, role: 'OWNER' as const }; const key = generateApiKey();
      await users.create(user); await keys.create({ id: crypto.randomUUID(), userId: user.id, keyHash: hashApiKey(key), label: 'initial-owner', createdAt: new Date().toISOString() });
      return reply.status(201).send({ data: { user, apiKey: key } });
    } finally { await pool.end(); }
  });
}