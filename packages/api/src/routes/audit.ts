import type { FastifyInstance } from 'fastify';
import type { AuditRepository } from '@axsd/storage';

export function registerAuditRoutes(app: FastifyInstance, audit: AuditRepository): void {
  app.get<{ Querystring: { limit?: number; actorId?: string; sessionId?: string; executionId?: string; risk?: string; status?: string } }>('/api/v1/audit', async (request, reply) => {
    if (!request.principal?.id) return reply.status(401).send({ error: { code: 'AUTH_ERR', message: 'Authentication required' } });
    const q=request.query;
    const raw=Number(q.limit ?? 100);
    if (!Number.isFinite(raw) || raw < 1) return reply.status(400).send({error:{code:'VALIDATION_ERR',message:'Invalid limit'}});
    const limit=Math.min(Math.floor(raw),500);
    const events=await audit.list(limit);
    const data=events.filter((e:any)=>
      (!q.actorId||e.actorId===q.actorId) && (!q.sessionId||e.sessionId===q.sessionId) &&
      (!q.executionId||e.executionId===q.executionId) && (!q.risk||e.risk===q.risk) && (!q.status||e.status===q.status)
    );
    return { data, limit };
  });
}
