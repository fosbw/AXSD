import type { FastifyInstance } from 'fastify';
import { container } from '../container.js';
import type { SessionRecord } from '@axsd/storage';
const statuses:readonly SessionRecord['status'][]=['active','paused','stopped','archived'];
export function registerSessionRoutes(app:FastifyInstance):void{
 app.get('/api/v1/sessions',async(request,reply)=>{const userId=request.principal?.id;if(!userId)return reply.status(401).send({error:{code:'AUTH_ERR',message:'Authentication required'}});return{data:await container.sessions.list(userId)}});
 app.post<{Body:{projectId?:string}}>('/api/v1/sessions',async(request,reply)=>{const userId=request.principal?.id;if(!userId)return reply.status(401).send({error:{code:'AUTH_ERR',message:'Authentication required'}});const session:SessionRecord={id:crypto.randomUUID(),userId,projectId:request.body?.projectId,status:'active',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};await container.sessions.create(session);return reply.status(201).send({data:session});});
 app.post<{Params:{id:string};Body:{status:SessionRecord['status']}}>('/api/v1/sessions/:id/status',async(request,reply)=>{const userId=request.principal?.id;if(!userId)return reply.status(401).send({error:{code:'AUTH_ERR',message:'Authentication required'}});if(!statuses.includes(request.body?.status))return reply.status(400).send({error:{code:'VALIDATION_ERR',message:'Invalid session status'}});const session=await container.sessions.update(request.params.id,userId,request.body.status);if(!session)return reply.status(404).send({error:{code:'NOT_FOUND',message:'Session not found'}});return{data:session};});
}
