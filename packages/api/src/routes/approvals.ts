import type { FastifyInstance } from 'fastify';

export type ApprovalDecision = 'APPROVE_ONCE' | 'APPROVE_SESSION' | 'DENY' | 'CANCEL';
const approvals: Array<{ id: string; requestedBy: string; action: string; risk: string; status: 'pending' | ApprovalDecision; createdAt: string }> = [];

export function registerApprovalRoutes(app: FastifyInstance): void {
  app.get('/api/v1/approvals', async () => ({ data: approvals.filter(x => x.status === 'pending') }));
  app.post<{ Params: { id: string }; Body: { decision: ApprovalDecision } }>('/api/v1/approvals/:id/decision', async (request, reply) => {
    const item = approvals.find(x => x.id === request.params.id);
    if (!item) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Approval not found' } });
    if (item.status !== 'pending') return reply.status(409).send({ error: { code: 'CONFLICT', message: 'Approval already decided' } });
    item.status = request.body.decision;
    return { data: item };
  });
}