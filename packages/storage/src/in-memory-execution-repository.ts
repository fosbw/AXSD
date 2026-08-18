import type { ExecutionRecord } from './execution-repository.js';

export class InMemoryExecutionRepository {
  private readonly records = new Map<string, ExecutionRecord>();
  async create(record: ExecutionRecord): Promise<void> { this.records.set(record.id, structuredClone(record)); }
  async get(id: string): Promise<ExecutionRecord | null> { const record=this.records.get(id); return record ? structuredClone(record) : null; }
  async listForUser(userId: string, limit=100): Promise<ExecutionRecord[]> {
    const safe=Math.min(Math.max(limit,1),1000);
    return [...this.records.values()].filter(x=>x.userId===userId).sort((a,b)=>b.id.localeCompare(a.id)).slice(0,safe).map(structuredClone);
  }
  async updateStatus(id:string,status:ExecutionRecord['status'],errorCode?:string):Promise<void>{const current=this.records.get(id);if(!current)return;const terminal=status==='COMPLETED'||status==='FAILED'||status==='CANCELLED';this.records.set(id,{...current,status,errorCode,finishedAt:terminal?new Date().toISOString():current.finishedAt});}
  async updateOutcome(id:string,patch:Pick<ExecutionRecord,'costActual'|'costEstimated'|'inputTokens'|'outputTokens'|'durationMs'|'result'|'checkpointId'>):Promise<void>{const current=this.records.get(id);if(!current)return;this.records.set(id,{...current,...structuredClone(patch)});}
}
