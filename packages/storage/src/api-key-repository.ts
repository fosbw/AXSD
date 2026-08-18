import type { Pool } from 'pg';
export interface ApiKeyRecord { id: string; userId: string; keyHash: string; label: string; createdAt: string; revokedAt?: string; }
export class PostgresApiKeyRepository {
  constructor(private readonly pool: Pool) {}
  async findActiveByHash(hash: string): Promise<ApiKeyRecord | null> { const { rows } = await this.pool.query('SELECT id,user_id AS "userId",key_hash AS "keyHash",label,created_at AS "createdAt",revoked_at AS "revokedAt" FROM api_keys WHERE key_hash=$1 AND revoked_at IS NULL', [hash]); return rows[0] ?? null; }
  async create(record: ApiKeyRecord): Promise<void> { await this.pool.query('INSERT INTO api_keys(id,user_id,key_hash,label) VALUES($1,$2,$3,$4)', [record.id, record.userId, record.keyHash, record.label]); }
}