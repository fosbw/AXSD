import type { AdapterContext, HealthResult } from './contracts.js';

export interface McpServerConfig {
  endpoint: string;
  headers?: Record<string,string>;
  allowedHosts?: readonly string[];
  timeoutMs?: number;
}

export class McpHttpClient {
  private readonly url: URL;
  private readonly timeoutMs: number;
  constructor(private readonly cfg: McpServerConfig) {
    this.url = new URL(cfg.endpoint);
    if (this.url.protocol !== 'http:' && this.url.protocol !== 'https:') throw new Error('MCP_ENDPOINT_SCHEME_NOT_ALLOWED');
    if (cfg.allowedHosts?.length && !cfg.allowedHosts.includes(this.url.hostname)) throw new Error('MCP_ENDPOINT_HOST_NOT_ALLOWED');
    this.timeoutMs = Math.min(120_000, Math.max(1_000, cfg.timeoutMs ?? 30_000));
  }

  private async call(method:string, params:unknown, ctx:AdapterContext) {
    const timeout = AbortSignal.timeout(this.timeoutMs);
    const signal = AbortSignal.any([ctx.signal, timeout]);
    const r = await fetch(this.url, {
      method:'POST',
      headers:{'content-type':'application/json', ...this.cfg.headers},
      body:JSON.stringify({jsonrpc:'2.0',id:crypto.randomUUID(),method,params}),
      signal,
    });
    if (!r.ok) throw new Error(`MCP_HTTP_${r.status}`);
    const body = await r.json() as {result?:unknown;error?:{message?:string}};
    if (body.error) throw new Error(body.error.message || 'MCP_ERROR');
    return body.result;
  }

  async listTools(ctx:AdapterContext){return this.call('tools/list',{},ctx);}
  async callTool(name:string,args:unknown,ctx:AdapterContext){return this.call('tools/call',{name,arguments:args},ctx);}
  async health(ctx:AdapterContext):Promise<HealthResult>{try{await this.call('ping',{},ctx);return{status:'healthy'};}catch(e){return{status:'unhealthy',details:{error:e instanceof Error?e.message:'unknown'}};}}
}
