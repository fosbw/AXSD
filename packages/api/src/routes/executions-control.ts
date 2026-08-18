import type { FastifyInstance } from 'fastify';
import type { ExecutionStatus } from '@axsd/core';

const state = new Map<string, ExecutionStatus>();
export function registerExecutionControlRoutes(app: FastifyInstance): void {
  app.post<{ Params: { id: string } }>('/api/v1/executions/:id/stop', async (request) => { state.set(request.params.id, 'CANCELLED'); return { data: { id: request.params.id, status: 'CANCELLED' } }; });
  app.get<{ Params: { id: string } }>('/api/v1/executions/:id/status', async request => ({ data: { id: request.params.id, status: state.get(request.params.id) ?? 'QUEUED' } }));
}