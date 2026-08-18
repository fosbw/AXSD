import type { FastifyInstance } from 'fastify';
import type { ExecutionStatus } from '@axsd/core';

const state = new Map<string, ExecutionStatus>();
const terminal = new Set<ExecutionStatus>(['COMPLETED','FAILED','CANCELLED']);

export function registerExecutionControlRoutes(app: FastifyInstance): void {
  app.post<{ Params: { id: string } }>('/api/v1/executions/:id/stop', async (request, reply) => {
    if (!request.principal?.id) return reply.status(401).send({ error: { code: 'AUTH_ERR', message: 'Authentication required' } });
    const current = state.get(request.params.id);
    if (!current) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Execution not found' } });
    if (terminal.has(current)) return reply.status(409).send({ error: { code: 'CONFLICT', message: 'Execution is already terminal' } });
    state.set(request.params.id, 'CANCELLED');
    return { data: { id: request.params.id, status: 'CANCELLED' } };
  });

  app.get<{ Params: { id: string } }>('/api/v1/executions/:id/status', async (request, reply) => {
    if (!request.principal?.id) return reply.status(401).send({ error: { code: 'AUTH_ERR', message: 'Authentication required' } });
    const status = state.get(request.params.id);
    if (!status) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Execution not found' } });
    return { data: { id: request.params.id, status } };
  });
}
