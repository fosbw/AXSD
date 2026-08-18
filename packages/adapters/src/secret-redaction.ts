const KEY=/authorization|api[-_]?key|token|password|secret|private[-_]?key|cookie/i;
export function redactSecrets(value:unknown):unknown{if(Array.isArray(value))return value.map(redactSecrets);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value as Record<string,unknown>).map(([k,v])=>[k,KEY.test(k)?'[REDACTED]':redactSecrets(v)]));return value;}
