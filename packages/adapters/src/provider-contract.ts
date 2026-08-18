export interface ProviderUsage{inputTokens?:number;outputTokens?:number;cachedTokens?:number;reasoningTokens?:number;cost?:{kind:'actual'|'estimated'|'unknown';amount?:number;currency?:string};}
export interface ProviderRequest{model:string;messages:unknown[];tools?:unknown[];metadata?:Record<string,unknown>;}
export interface ProviderResponse{output:unknown;usage:ProviderUsage;providerRequestId?:string;finishReason?:string;}
export interface ModelProviderAdapter{readonly id:string;supports(capability:string):boolean;invoke(request:ProviderRequest,signal?:AbortSignal):Promise<ProviderResponse>;health():Promise<'healthy'|'degraded'|'unhealthy'>;}
