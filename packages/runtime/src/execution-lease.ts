export interface ExecutionLease { executionId:string; ownerId:string; expiresAt:number; }
export class InMemoryExecutionLeaseStore {
  private leases = new Map<string, ExecutionLease>();
  acquire(executionId:string, ownerId:string, ttlMs:number):ExecutionLease|null { const now=Date.now(); const current=this.leases.get(executionId); if(current && current.expiresAt>now && current.ownerId!==ownerId)return null; const lease={executionId,ownerId,expiresAt:now+ttlMs}; this.leases.set(executionId,lease); return lease; }
  renew(executionId:string,ownerId:string,ttlMs:number):ExecutionLease|null { const current=this.leases.get(executionId); if(!current||current.ownerId!==ownerId||current.expiresAt<Date.now())return null; current.expiresAt=Date.now()+ttlMs; return current; }
  release(executionId:string,ownerId:string):boolean { const current=this.leases.get(executionId); if(!current||current.ownerId!==ownerId)return false; this.leases.delete(executionId); return true; }
}
