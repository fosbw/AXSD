export interface LeaseFence { executionId:string; generation:number; }
export function sameFence(a:LeaseFence,b:LeaseFence):boolean{return a.executionId===b.executionId&&a.generation===b.generation;}
export function nextFence(current:LeaseFence):LeaseFence{return {executionId:current.executionId,generation:current.generation+1};}
