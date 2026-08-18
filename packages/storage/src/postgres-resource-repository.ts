import type { Pool } from 'pg';
import type { ResourceRecord, ResourceRepository } from './repositories.js';

const SELECT = 'SELECT id,name,type,provider,version,capabilities,status,health,source,adapter,metadata,created_at AS "createdAt",updated_at AS "updatedAt",last_seen AS "lastSeen" FROM resources';

export class PostgresResourceRepository implements ResourceRepository {
  constructor(private readonly pool: Pool) {}
  async list(): Promise<ResourceRecord[]> { const { rows } = await this.pool.query(`${SELECT} ORDER BY name`); return rows as ResourceRecord[]; }
  async get(id: string): Promise<ResourceRecord | null> { const { rows } = await this.pool.query(`${SELECT} WHERE id=$1`, [id]); return (rows[0] as ResourceRecord | undefined) ?? null; }
  async upsert(resource: ResourceRecord): Promise<void> {
    await this.pool.query(
      `INSERT INTO resources(id,name,type,provider,version,capabilities,status,health,source,adapter,metadata,last_seen)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,type=EXCLUDED.type,provider=EXCLUDED.provider,version=EXCLUDED.version,
       capabilities=EXCLUDED.capabilities,status=EXCLUDED.status,health=EXCLUDED.health,source=EXCLUDED.source,
       adapter=EXCLUDED.adapter,metadata=EXCLUDED.metadata,last_seen=EXCLUDED.last_seen,updated_at=NOW()`,
      [resource.id, resource.name, resource.type, resource.provider, resource.version ?? null,
        JSON.stringify(resource.capabilities), resource.status, resource.health ?? 'unknown', resource.source ?? 'api',
        resource.adapter ?? 'default', JSON.stringify(resource.metadata), resource.lastSeen ?? null]
    );
  }
  async remove(id: string): Promise<boolean> { const result = await this.pool.query('DELETE FROM resources WHERE id=$1', [id]); return (result.rowCount ?? 0) > 0; }
}