export interface ToolExecutionRequest{name:string;arguments:unknown;timeoutMs?:number;signal?:AbortSignal;}
export interface ToolExecutionResult{output:unknown;durationMs:number;metadata?:Record<string,unknown>;}
export interface ToolAdapter{readonly id:string;capabilities():Promise<string[]>;execute(request:ToolExecutionRequest):Promise<ToolExecutionResult>;health():Promise<'healthy'|'degraded'|'unhealthy'>;}
