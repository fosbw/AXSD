import type { Resource } from '@axsd/core';
import type { DiscoveryContext, DiscoveryProvider } from './discovery.js';

type DiscoveredResource = Partial<Resource>;

/** Registry for trusted discovery providers; providers are explicit, never auto-executed. */
export class DiscoveryRegistry {
  private readonly providers = new Map<string, DiscoveryProvider>();

  register(provider: DiscoveryProvider): void {
    if (!provider.id) throw new Error('INVALID_DISCOVERY_PROVIDER');
    if (this.providers.has(provider.id)) throw new Error(`DISCOVERY_PROVIDER_ALREADY_REGISTERED:${provider.id}`);
    this.providers.set(provider.id, provider);
  }

  remove(id: string): boolean { return this.providers.delete(id); }
  list(): DiscoveryProvider[] { return [...this.providers.values()]; }

  async discover(context: DiscoveryContext): Promise<DiscoveredResource[]> {
    const results: DiscoveredResource[] = [];
    for (const provider of this.providers.values()) {
      if (context.signal.aborted) break;
      try {
        results.push(...await provider.discover(context));
      } catch {
        // A failed provider must not stop other discovery providers.
      }
    }
    return results;
  }
}
