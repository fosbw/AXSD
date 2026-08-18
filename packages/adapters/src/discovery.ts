import type { Resource } from '@axsd/core';

export interface DiscoveryContext { readonly environment: string; readonly actorId: string; readonly signal: AbortSignal; }
export interface DiscoveryProvider { readonly id: string; discover(context: DiscoveryContext): Promise<Partial<Resource>[]>; }

export async function safeDiscover(provider: DiscoveryProvider, context: DiscoveryContext): Promise<Partial<Resource>[]> {
  if (context.signal.aborted) return [];
  const results = await provider.discover(context);
  return results.filter(r => Boolean(r.id && r.name && r.type && r.provider));
}