import { Pool, type PoolConfig } from 'pg';

export function createPool(config: PoolConfig = {}): Pool {
  return new Pool({ connectionString: process.env.DATABASE_URL, max: 10, idleTimeoutMillis: 30_000, ...config });
}

export async function checkDatabase(pool: Pool): Promise<void> { await pool.query('SELECT 1'); }