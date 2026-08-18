import type { FastifyInstance } from 'fastify';
import type { PolicyRule } from '@axsd/core';
const policies:Array<PolicyRule & {ownerId:string}> = [];
export function registerPolicyRoutes(app:FastifyInstance):void{
 app.get('/api/v1/policies',async(request,reply)=>{const ownerId=request.principal?.id;if(!ownerId)return reply.status(401).send({error:{code:'AUTH_ERR',message:'Authentication required'}});return{data:policies.filter(p=>p.ownerId===ownerId).map(({ownerId:_ownerId,...p})=>p)}});
 app.post<{Body:PolicyRule}>('/api/v1/policies',async(request,reply)=>{const ownerId=request.principal?.id;if(!ownerId)return reply.status(401).send({error:{code:'AUTH_ERR',message:'Authentication required'}});const body=request.body;if(!body||typeof body!=='object'||typeof body.id!=='string'||!body.id.trim()||typeof body.name!=='string'||!body.name.trim())return reply.status(400).send({error:{code:'VALIDATION_ERR',message:'Policy id and name are required'}});if(policies.some(p=>p.id===body.id&&p.ownerId===ownerId))return reply.status(409).send({error:{code:'CONFLICT',message:'Policy already exists'}});const policy={...body,id:body.id.trim(),name:body.name.trim(),ownerId};policies.push(policy);return reply.status(201).send({data:body});});
}
