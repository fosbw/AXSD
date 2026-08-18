export interface Counter { inc(value?:number):void; get():number; }
export function counter():Counter{let n=0;return{inc(v=1){n+=v;},get(){return n;}}}
export const metrics={requests:counter(),executions:counter(),failures:counter(),approvals:counter()};
