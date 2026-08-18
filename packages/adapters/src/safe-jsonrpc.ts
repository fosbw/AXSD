export interface JsonRpcRequest { jsonrpc:'2.0'; id:string|number; method:string; params?:unknown; }
export interface JsonRpcResponse { jsonrpc:'2.0'; id:string|number|null; result?:unknown; error?:{code:number;message:string;data?:unknown}; }
export function validateJsonRpcResponse(value:unknown): value is JsonRpcResponse { if(!value||typeof value!=='object')return false; const v=value as Record<string,unknown>; return v.jsonrpc==='2.0' && ('result' in v || 'error' in v); }
export function assertAllowedMethod(method:string,allowed:ReadonlySet<string>):void { if(!allowed.has(method)) throw new Error('MCP_METHOD_NOT_ALLOWED'); }
