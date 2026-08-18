import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPool } from './postgres.js';

export async function migrate(): Promise<void> {
  const pool = createPool();
  try {
    await pool.query("CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");
    const directory = fileURLToPath(new URL('./migrations/', import.meta.url));
    for (const file of (await readdir(directory)).filter(name => /^\d+_.+\.sql$/.test(name)).sort()) {
      const version = file.replace(/\.sql$/, '');
      const result = await pool.query('SELECT 1 FROM schema_migrations WHERE version=$1', [version]);
      if (result.rowCount) continue;
      await pool.query(await readFile(join(directory, file), 'utf8'));
      await pool.query('INSERT INTO schema_migrations(version) VALUES ($1) ON CONFLICT DO NOTHING', [version]);
    }
  } finally { await pool.end(); }
}

if (process.argv[1]?.endsWith('migrate.js')) await migrate();