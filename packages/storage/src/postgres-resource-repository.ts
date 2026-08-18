import type { Pool } from 'pg';
import type { ResourceRecord, ResourceRepository } from './repositories.js';

export class PostgresResourceRepository implements ResourceRepository {
  constructor(private readonly pool: Pool) {}
  async list(): Promise<ResourceRecord[]> { const { rows } = await this.pool.query('SELECT id,name,type,provider,capabilities,status,metadata FROM resources ORDER BY name'); return rows as ResourceRecord[]; }
  async get(id: string): Promise<ResourceRecord | null> { const { rows } = await this.pool.query('SELECT id,name,type,provider,capabilities,status,metadata FROM resources WHERE id=$1', [id]); return (rows[0] as ResourceRecord | undefined) ?? null; }
  async upsert(resource: ResourceRecord): Promise<void> { await this.pool.query('INSERT INTO resources(id,name,type,provider,capabilities,status,health,source,adapter,metadata) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,type=EXCLUDED.type,provider=EXCLUDED.provider,capabilities=EXCLUDED.capabilities,status=EXCLUDED.status,metadata=EXCLUDED.metadata,updated_at=NOW()', [resource.id, resource.name, resource.type, resource.provider, JSON.stringify(resource.capabilities), resource.status, 'unknown', 'api', 'default', JSON.stringify(resource.metadata)]); }
  async remove(id: string): Promise<boolean> { const result = await this.pool.query('DELETE FROM resources WHERE id=$1', [id]); return (result.rowCount ?? 0) > 0; }
}