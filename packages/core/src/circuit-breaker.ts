export type CircuitState='CLOSED'|'OPEN'|'HALF_OPEN';
export interface Circuit { state:CircuitState; failures:number; threshold:number; openedAt?:number; cooldownMs:number; }
export function allowCircuit(c:Circuit, now=Date.now()):boolean { if(c.state==='CLOSED')return true; if(c.state==='OPEN' && c.openedAt!==undefined && now-c.openedAt>=c.cooldownMs){c.state='HALF_OPEN';return true;} return c.state==='HALF_OPEN'; }
export function recordSuccess(c:Circuit){c.failures=0;c.state='CLOSED';c.openedAt=undefined;}
export function recordFailure(c:Circuit, now=Date.now()){c.failures++;if(c.failures>=Math.max(1,c.threshold)){c.state='OPEN';c.openedAt=now;}}
