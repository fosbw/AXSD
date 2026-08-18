import type { FastifyInstance } from 'fastify';

const sessions: Array<{ id: string; projectId?: string; status: 'active' | 'paused' | 'stopped' | 'archived'; createdAt: string }> = [];

export function registerSessionRoutes(app: FastifyInstance): void {
  app.get('/api/v1/sessions', async () => ({ data: sessions }));
  app.post<{ Body: { projectId?: string } }>('/api/v1/sessions', async (request, reply) => {
    const session = { id: crypto.randomUUID(), projectId: request.body.projectId, status: 'active' as const, createdAt: new Date().toISOString() };
    sessions.push(session);
    return reply.status(201).send({ data: session });
  });
}