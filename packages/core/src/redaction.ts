const SECRET_KEYS = /^(authorization|api[-_]?key|token|password|secret|private[-_]?key|client[-_]?secret|cookie)$/i;

export function redactSecrets(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (!value || typeof value !== 'object') return value;
  const input = value as Record<string, unknown>;
  const output: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(input)) output[key] = SECRET_KEYS.test(key) ? '[REDACTED]' : redactSecrets(child);
  return output;
}

export function redactText(text: string): string {
  return text
    .replace(/Bearer\s+[A-Za-z0-9._~+\-/]+=*/gi, 'Bearer [REDACTED]')
    .replace(/(api[_-]?key|token|password|secret)\s*[:=]\s*[^\s,;]+/gi, '$1=[REDACTED]');
}
