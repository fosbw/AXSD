import type { Pool } from 'pg';

export type ExecutionStatus = 'QUEUED' | 'RUNNING' | 'WAITING_APPROVAL' | 'PAUSED' | 'RETRYING' | 'FAILED' | 'CANCELLED' | 'COMPLETED' | 'RECOVERING';
export interface ExecutionRecord { id: string; sessionId: string; userId: string; agentId?: string; modelId?: string; resourceId?: string; action: string; status: ExecutionStatus; startedAt?: string; finishedAt?: string; durationMs?: number; costActual?: number; costEstimated?: number; inputTokens?: number; outputTokens?: number; retries: number; checkpointId?: string; result?: unknown; errorCode?: string; }

export class PostgresExecutionRepository {
  constructor(private readonly pool: Pool) {}
  async create(e: ExecutionRecord): Promise<void> { await this.pool.query(`INSERT INTO executions(id,session_id,user_id,agent_id,model_id,resource_id,action,status,retries,checkpoint_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [e.id,e.sessionId,e.userId,e.agentId??null,e.modelId??null,e.resourceId??null,e.action,e.status,e.retries,e.checkpointId??null]); }
  async updateStatus(id: string,status: ExecutionStatus,errorCode?: string): Promise<void> { await this.pool.query(`UPDATE executions SET status=$2,error_code=$3,updated_at=now() WHERE id=$1`,[id,status,errorCode??null]); }
  async get(id: string): Promise<ExecutionRecord|null> { const {rows}=await this.pool.query(`SELECT id,session_id AS "sessionId",user_id AS "userId",agent_id AS "agentId",model_id AS "modelId",resource_id AS "resourceId",action,status,retries,checkpoint_id AS "checkpointId",error_code AS "errorCode" FROM executions WHERE id=$1`,[id]); return rows[0]??null; }
}
