import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import type { ExecutionStatus } from '@axsd/core';
import { container } from '../container.js';

const executions: Array<{ id: string; sessionId: string; userId: string; status: ExecutionStatus; createdAt: string; action: string; resourceId?: string }> = [];

export function registerExecutionRoutes(app: FastifyInstance): void {
  app.get('/api/v1/executions', async (request) => {
    const userId = request.principal?.id;
    if (!userId) return { data: [] };
    if (container.executions) return { data: await container.executions.listForUser(userId) };
    return { data: executions.filter((x) => x.userId === userId) };
  });

  app.post<{ Body: { sessionId: string; action: string; resourceId?: string; agentId?: string; modelId?: string } }>('/api/v1/executions', async (request, reply) => {
    const userId = request.principal?.id;
    if (!userId) return reply.status(401).send({ error: { code: 'AUTH_ERR', message: 'Authentication required' } });
    const { sessionId, action, resourceId, agentId, modelId } = request.body ?? {};
    if (!sessionId || !action) return reply.status(400).send({ error: { code: 'VALIDATION_ERR', message: 'sessionId and action are required' } });
    const execution = { id: randomUUID(), sessionId, userId, status: 'QUEUED' as const, createdAt: new Date().toISOString(), action, resourceId };
    if (container.executions) {
      await container.executions.create({ ...execution, agentId, modelId, retries: 0 });
    } else {
      executions.push(execution);
    }
    return reply.status(202).send({ data: execution });
  });

  app.get<{ Params: { id: string } }>('/api/v1/executions/:id', async (request, reply) => {
    const userId = request.principal?.id;
    if (!userId) return reply.status(401).send({ error: { code: 'AUTH_ERR', message: 'Authentication required' } });
    const execution = container.executions ? await container.executions.get(request.params.id) : executions.find(x => x.id === request.params.id && x.userId === userId);
    if (!execution || execution.userId !== userId) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Execution not found' } });
    return { data: execution };
  });
}
