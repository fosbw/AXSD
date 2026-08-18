export interface IdempotencyRecord { key: string; executionId: string; createdAt: string; expiresAt?: string; }

export function normalizeIdempotencyKey(value: string): string {
  const key = value.trim();
  if (!key || key.length > 256) throw new Error('Invalid idempotency key');
  return key;
}
