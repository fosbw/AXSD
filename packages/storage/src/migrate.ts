import { readFile } from 'node:fs/promises';
import { createPool } from './postgres.js';

export async function migrate(): Promise<void> {
  const pool = createPool();
  try { const sql = await readFile(new URL('./schema.sql', import.meta.url), 'utf8'); await pool.query(sql); } finally { await pool.end(); }
}

if (process.argv[1]?.endsWith('migrate.js')) await migrate();