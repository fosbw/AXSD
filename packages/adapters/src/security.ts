export function redactSecrets(value: unknown): unknown {
  if (typeof value === 'string') return value.replace(/(api[_-]?key|token|password|secret|private[_-]?key)\s*[:=]\s*[^\s,}]+/gi, '$1=[REDACTED]');
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [/api[_-]?key|token|password|secret|private[_-]?key/i.test(k) ? k : k, /api[_-]?key|token|password|secret|private[_-]?key/i.test(k) ? '[REDACTED]' : redactSecrets(v)]));
  return value;
}