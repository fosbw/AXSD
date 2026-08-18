import type { FastifyInstance } from 'fastify';
import type { Budget } from '@axsd/core';
const budgets = new Map<string, {ownerId:string;budget:Budget}>();
function validBudget(b:any): b is Budget { return !!b && Object.values(b).every((v:any)=>v===undefined || (typeof v==='number' && Number.isFinite(v) && v>=0)); }
export function registerBudgetRoutes(app: FastifyInstance): void {
  app.get('/api/v1/budgets', async (request,reply) => { const userId=request.principal?.id;if(!userId)return reply.status(401).send({error:{code:'AUTH_ERR',message:'Authentication required'}});return {data:[...budgets.entries()].filter(([,x])=>x.ownerId===userId).map(([id,x])=>({id,budget:x.budget}))}; });
  app.put<{Params:{id:string};Body:Budget}>('/api/v1/budgets/:id',async(request,reply)=>{const userId=request.principal?.id;if(!userId)return reply.status(401).send({error:{code:'AUTH_ERR',message:'Authentication required'}});if(!validBudget(request.body))return reply.status(400).send({error:{code:'VALIDATION_ERR',message:'Invalid budget'}});const current=budgets.get(request.params.id);if(current&&current.ownerId!==userId)return reply.status(403).send({error:{code:'FORBIDDEN',message:'Budget is owned by another user'}});budgets.set(request.params.id,{ownerId:userId,budget:request.body});return {data:{id:request.params.id,budget:request.body}};});
}
