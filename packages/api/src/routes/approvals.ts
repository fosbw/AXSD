import type { FastifyInstance } from 'fastify';
import { PostgresApprovalRepository, createPool } from '@axsd/storage';
export type ApprovalDecision='APPROVE_ONCE'|'APPROVE_SESSION'|'DENY'|'CANCEL';
const DECISIONS: readonly ApprovalDecision[]=['APPROVE_ONCE','APPROVE_SESSION','DENY','CANCEL'];
const approvals:Array<{id:string;requestedBy:string;action:string;risk:string;status:'pending'|ApprovalDecision;createdAt:string}>=[];

export function registerApprovalRoutes(app:FastifyInstance){
  app.get('/api/v1/approvals',async request=>{
    if(process.env.DATABASE_URL){const pool=createPool();try{return{data:await new PostgresApprovalRepository(pool).listPending()}}finally{await pool.end();}}
    return{data:approvals.filter(x=>x.status==='pending'&&x.requestedBy===request.principal?.id)};
  });
  app.post<{Params:{id:string};Body:{decision:ApprovalDecision}}>('/api/v1/approvals/:id/decision',async(request,reply)=>{
    const decision=request.body?.decision;
    if(!DECISIONS.includes(decision))return reply.status(400).send({error:{code:'VALIDATION_ERR',message:'invalid decision'}});
    const actor=request.principal?.id;
    if(!actor)return reply.status(401).send({error:{code:'AUTH_ERR',message:'Authentication required'}});
    if(process.env.DATABASE_URL){
      const pool=createPool();
      try{await new PostgresApprovalRepository(pool).decide(request.params.id,decision,actor);return{data:{id:request.params.id,decision}}}
      catch(e){return reply.status(409).send({error:{code:'CONFLICT',message:e instanceof Error?e.message:'approval unavailable'}})}finally{await pool.end();}
    }
    const item=approvals.find(x=>x.id===request.params.id&&x.requestedBy===actor);
    if(!item)return reply.status(404).send({error:{code:'NOT_FOUND',message:'Approval not found'}});
    if(item.status!=='pending')return reply.status(409).send({error:{code:'CONFLICT',message:'Approval already decided'}});
    item.status=decision;
    return{data:item};
  });
}
