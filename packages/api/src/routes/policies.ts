import type { FastifyInstance } from 'fastify';
import type { PolicyRule } from '@axsd/core';

const policies: PolicyRule[] = [];
export function registerPolicyRoutes(app: FastifyInstance): void {
  app.get('/api/v1/policies', async () => ({ data: policies }));
  app.post<{ Body: PolicyRule }>('/api/v1/policies', async (request, reply) => {
    if (!request.body.id || !request.body.name) return reply.status(400).send({ error: { code: 'VALIDATION_ERR', message: 'Policy id and name are required' } });
    policies.push(request.body);
    return reply.status(201).send({ data: request.body });
  });
}