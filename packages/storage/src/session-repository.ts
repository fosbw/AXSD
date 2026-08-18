import type { Pool } from 'pg';
export type SessionStatus='active'|'paused'|'stopped'|'archived';
export interface SessionRecord{id:string;userId:string;projectId?:string;status:SessionStatus;createdAt:string;updatedAt?:string;}
export class PostgresSessionRepository{
 constructor(private readonly pool:Pool){}
 async create(v:SessionRecord){await this.pool.query(`INSERT INTO sessions(id,user_id,project_id,status) VALUES($1,$2,$3,$4)`,[v.id,v.userId,v.projectId??null,v.status]);return v;}
 async get(id:string,userId:string){const {rows}=await this.pool.query(`SELECT id,user_id AS "userId",project_id AS "projectId",status,created_at AS "createdAt",updated_at AS "updatedAt" FROM sessions WHERE id=$1 AND user_id=$2`,[id,userId]);return rows[0]??null;}
 async list(userId:string,limit=100){const safe=Math.min(Math.max(limit,1),1000);const {rows}=await this.pool.query(`SELECT id,user_id AS "userId",project_id AS "projectId",status,created_at AS "createdAt",updated_at AS "updatedAt" FROM sessions WHERE user_id=$1 ORDER BY updated_at DESC LIMIT $2`,[userId,safe]);return rows as SessionRecord[];}
 async update(id:string,userId:string,status:SessionStatus){const {rows}=await this.pool.query(`UPDATE sessions SET status=$3,updated_at=NOW() WHERE id=$1 AND user_id=$2 RETURNING id,user_id AS "userId",project_id AS "projectId",status,created_at AS "createdAt",updated_at AS "updatedAt"`,[id,userId,status]);return rows[0]??null;}
}
export class InMemorySessionRepository{private readonly items=new Map<string,SessionRecord>();create(v:SessionRecord){this.items.set(v.id,v);return v;}get(id:string,userId?:string){const v=this.items.get(id);return v&&(!userId||v.userId===userId)?v:null;}list(userId?:string){return[...this.items.values()].filter(v=>!userId||v.userId===userId);}update(id:string,status:SessionStatus,userId?:string){const item=this.get(id,userId);if(!item)return null;const updated={...item,status,updatedAt:new Date().toISOString()};this.items.set(id,updated);return updated;}}
