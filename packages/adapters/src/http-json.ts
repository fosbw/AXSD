import type { Resource, Execution } from '@axsd/core';
import type { AdapterContext, ResourceAdapter } from './contracts.js';
import type { SecretResolver } from './secrets.js';

export class HttpJsonAdapter implements ResourceAdapter {
  readonly id = 'http-json';
  constructor(private readonly baseUrl: string, private readonly secrets: SecretResolver) {}
  readonly resourceType: Resource['type'] = 'api';
  async discover(_context: AdapterContext) { return { resources: [] as Resource[] }; }
  async health(_resource: Resource, context: AdapterContext) { const response = await fetch(this.baseUrl, { signal: context.signal }); return { status: response.ok ? 'healthy' as const : 'degraded' as const }; }
  async capabilities(_resource: Resource, _context: AdapterContext) { return ['execute']; }
  async execute(_resource: Resource, action: string, args: unknown, context: AdapterContext): Promise<Pick<Execution, 'result' | 'cost' | 'tokens'>> { const credential = await this.secrets.resolve('AXSD_HTTP_API_KEY'); const response = await fetch(this.baseUrl, { method: 'POST', signal: context.signal, headers: { authorization: `Bearer ${credential}`, 'content-type': 'application/json' }, body: JSON.stringify({ action, arguments: args }) }); if (!response.ok) throw new Error(`UPSTREAM_HTTP_${response.status}`); return { result: await response.json() }; }
}