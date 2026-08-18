import type { Adapter } from './contracts.js';

export async function checkAdapterHealth(adapter: Adapter): Promise<'healthy' | 'unhealthy'> {
  try { const result = await adapter.healthCheck(); return result ? 'healthy' : 'unhealthy'; } catch { return 'unhealthy'; }
}