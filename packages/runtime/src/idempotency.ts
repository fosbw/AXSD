import { createHash } from 'node:crypto';

/** Collision-resistant encoding for structured idempotency components. */
export function idempotencyKey(parts: string[]): string {
  const canonical = parts.map(part => `${part.length}:${part}`).join('|');
  return createHash('sha256').update(canonical, 'utf8').digest('hex');
}

export interface IdempotencyStore {
  get(key: string): Promise<unknown | null>;
  put(key: string, value: unknown, ttlMs: number): Promise<void>;
}

/**
 * Test/local implementation only. Production deployments must provide a durable,
 * shared implementation when more than one worker can execute the same workload.
 */
export class InMemoryIdempotencyStore implements IdempotencyStore {
  private readonly m = new Map<string, { value: unknown; expiresAt: number }>();

  async get(key: string): Promise<unknown | null> {
    const entry = this.m.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      this.m.delete(key);
      return null;
    }
    return entry.value;
  }

  async put(key: string, value: unknown, ttlMs: number): Promise<void> {
    if (!Number.isFinite(ttlMs) || ttlMs <= 0) throw new Error('INVALID_IDEMPOTENCY_TTL');
    this.m.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
}
