import type { Pool } from 'pg';

export type ExecutionStatus = 'QUEUED' | 'RUNNING' | 'WAITING_APPROVAL' | 'PAUSED' | 'RETRYING' | 'FAILED' | 'CANCELLED' | 'COMPLETED' | 'RECOVERING';
export interface ExecutionRecord { id: string; sessionId: string; userId: string; agentId?: string; modelId?: string; resourceId?: string; action: string; status: ExecutionStatus; startedAt?: string; finishedAt?: string; durationMs?: number; costActual?: number; costEstimated?: number; inputTokens?: number; outputTokens?: number; retries: number; checkpointId?: string; result?: unknown; errorCode?: string; }

export class PostgresExecutionRepository {
  constructor(private readonly pool: Pool) {}
  async create(e: ExecutionRecord): Promise<void> {
    await this.pool.query(`INSERT INTO executions(id,session_id,user_id,agent_id,model_id,resource_id,action,status,retries,checkpoint_id,started_at,finished_at,duration_ms,cost_actual,cost_estimated,input_tokens,output_tokens,result) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`, [e.id,e.sessionId,e.userId,e.agentId??null,e.modelId??null,e.resourceId??null,e.action,e.status,e.retries,e.checkpointId??null,e.startedAt??null,e.finishedAt??null,e.durationMs??null,e.costActual??null,e.costEstimated??null,e.inputTokens??null,e.outputTokens??null,e.result==null?null:JSON.stringify(e.result)]);
  }
  async updateStatus(id: string,status: ExecutionStatus,errorCode?: string): Promise<void> {
    await this.pool.query(`UPDATE executions SET status=$2,error_code=$3,finished_at=CASE WHEN $2 IN ('COMPLETED','FAILED','CANCELLED') THEN now() ELSE finished_at END,updated_at=now() WHERE id=$1`,[id,status,errorCode??null]);
  }
  async updateOutcome(id: string, patch: Pick<ExecutionRecord,'costActual'|'costEstimated'|'inputTokens'|'outputTokens'|'durationMs'|'result'|'checkpointId'>): Promise<void> {
    await this.pool.query(`UPDATE executions SET cost_actual=$2,cost_estimated=$3,input_tokens=$4,output_tokens=$5,duration_ms=$6,result=$7,checkpoint_id=$8,updated_at=now() WHERE id=$1`, [id,patch.costActual??null,patch.costEstimated??null,patch.inputTokens??null,patch.outputTokens??null,patch.durationMs??null,patch.result==null?null:JSON.stringify(patch.result),patch.checkpointId??null]);
  }
  async get(id: string): Promise<ExecutionRecord|null> {
    const {rows}=await this.pool.query(`SELECT id,session_id AS "sessionId",user_id AS "userId",agent_id AS "agentId",model_id AS "modelId",resource_id AS "resourceId",action,status,started_at AS "startedAt",finished_at AS "finishedAt",duration_ms AS "durationMs",cost_actual AS "costActual",cost_estimated AS "costEstimated",input_tokens AS "inputTokens",output_tokens AS "outputTokens",retries,checkpoint_id AS "checkpointId",result,error_code AS "errorCode" FROM executions WHERE id=$1`,[id]);
    return rows[0]??null;
  }
  async listForUser(userId: string, limit = 100): Promise<ExecutionRecord[]> {
    const safeLimit = Math.min(Math.max(limit, 1), 1000);
    const {rows}=await this.pool.query(`SELECT id,session_id AS "sessionId",user_id AS "userId",agent_id AS "agentId",model_id AS "modelId",resource_id AS "resourceId",action,status,started_at AS "startedAt",finished_at AS "finishedAt",duration_ms AS "durationMs",cost_actual AS "costActual",cost_estimated AS "costEstimated",input_tokens AS "inputTokens",output_tokens AS "outputTokens",retries,checkpoint_id AS "checkpointId",result,error_code AS "errorCode" FROM executions WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2`, [userId, safeLimit]);
    return rows;
  }
}
