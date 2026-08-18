import type { ResourceAdapter, AdapterContext } from './contracts.js';
import type { Resource } from '@axsd/core';

export async function checkAdapterHealth(adapter: ResourceAdapter, resource: Resource, context: AdapterContext): Promise<'healthy' | 'degraded' | 'unhealthy'> {
  try { return (await adapter.health(resource, context)).status; } catch { return 'unhealthy'; }
}