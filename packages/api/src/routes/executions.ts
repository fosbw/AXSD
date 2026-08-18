import type { FastifyInstance } from 'fastify';
import type { ExecutionStatus } from '@axsd/core';

const executions: Array<{ id: string; sessionId: string; status: ExecutionStatus; createdAt: string }> = [];

export function registerExecutionRoutes(app: FastifyInstance): void {
  app.get('/api/v1/executions', async () => ({ data: executions }));
  app.get<{ Params: { id: string } }>('/api/v1/executions/:id', async (request, reply) => {
    const execution = executions.find(x => x.id === request.params.id);
    if (!execution) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Execution not found' } });
    return { data: execution };
  });
}