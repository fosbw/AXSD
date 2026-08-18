import type { FastifyInstance } from 'fastify';
import type { Execution } from '@axsd/core';

const executions = new Map<string, Execution>();
export function registerExecutionCreateRoute(app: FastifyInstance): void {
  app.post<{ Body: Execution['request'] }>('/api/v1/executions', async (request, reply) => {
    const execution: Execution = { id: crypto.randomUUID(), request: request.body, status: 'QUEUED', retries: 0 };
    executions.set(execution.id, execution);
    return reply.status(202).send({ data: execution });
  });
}