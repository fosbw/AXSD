import type { FastifyInstance } from 'fastify';
import type { Budget } from '@axsd/core';

const budgets = new Map<string, Budget>();
export function registerBudgetRoutes(app: FastifyInstance): void {
  app.get('/api/v1/budgets', async () => ({ data: [...budgets.entries()].map(([id, budget]) => ({ id, budget })) }));
  app.put<{ Params: { id: string }; Body: Budget }>('/api/v1/budgets/:id', async (request) => { budgets.set(request.params.id, request.body); return { data: { id: request.params.id, budget: request.body } }; });
}