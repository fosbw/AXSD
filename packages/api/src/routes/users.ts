import type { FastifyInstance } from 'fastify';
import type { PostgresUserRepository } from '@axsd/storage';

export function registerUserRoutes(app: FastifyInstance, users: PostgresUserRepository | null): void {
  app.get<{ Params: { id: string } }>('/api/v1/users/:id', async (request, reply) => { if (!users) return reply.status(503).send({ error: { code: 'INTERNAL_ERR', message: 'User storage unavailable' } }); const user = await users.get(request.params.id); if (!user) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'User not found' } }); return { data: user }; });
}