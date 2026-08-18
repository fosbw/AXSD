import type { FastifyInstance } from 'fastify';
import { container } from '../container.js';
import type { SessionRecord } from '@axsd/storage';
const statuses: readonly SessionRecord['status'][] = ['active','paused','stopped','archived'];
const transitions: Record<SessionRecord['status'], readonly SessionRecord['status'][]> = {
  active: ['paused','stopped','archived'], paused: ['active','stopped','archived'], stopped: ['archived'], archived: []
};
export function registerSessionRoutes(app: FastifyInstance): void {
  app.get('/api/v1/sessions', async (request, reply) => {
    const userId=request.principal?.id; if(!userId)return reply.status(401).send({error:{code:'AUTH_ERR',message:'Authentication required'}});
    return {data: await container.sessions.list(userId)};
  });
  app.get<{Params:{id:string}}>('/api/v1/sessions/:id', async(request,reply)=>{
    const userId=request.principal?.id;if(!userId)return reply.status(401).send({error:{code:'AUTH_ERR',message:'Authentication required'}});
    const session=await container.sessions.get(request.params.id,userId);if(!session)return reply.status(404).send({error:{code:'NOT_FOUND',message:'Session not found'}});return{data:session};
  });
  app.post<{Body:{projectId?:string}}>('/api/v1/sessions',async(request,reply)=>{
    const userId=request.principal?.id;if(!userId)return reply.status(401).send({error:{code:'AUTH_ERR',message:'Authentication required'}});
    const projectId=request.body?.projectId;if(projectId!==undefined&&typeof projectId!=='string')return reply.status(400).send({error:{code:'VALIDATION_ERR',message:'Invalid projectId'}});
    const now=new Date().toISOString();const session:SessionRecord={id:crypto.randomUUID(),userId,projectId,status:'active',createdAt:now,updatedAt:now};await container.sessions.create(session);return reply.status(201).send({data:session});
  });
  app.post<{Params:{id:string};Body:{status:SessionRecord['status']}}>('/api/v1/sessions/:id/status',async(request,reply)=>{
    const userId=request.principal?.id;if(!userId)return reply.status(401).send({error:{code:'AUTH_ERR',message:'Authentication required'}});
    const next=request.body?.status;if(!statuses.includes(next))return reply.status(400).send({error:{code:'VALIDATION_ERR',message:'Invalid session status'}});
    const current=await container.sessions.get(request.params.id,userId);if(!current)return reply.status(404).send({error:{code:'NOT_FOUND',message:'Session not found'}});
    if(current.status===next)return{data:current};if(!transitions[current.status].includes(next))return reply.status(409).send({error:{code:'INVALID_TRANSITION',message:`Cannot transition ${current.status} to ${next}`}});
    const session=await container.sessions.update(request.params.id,userId,next);return{data:session};
  });
}
