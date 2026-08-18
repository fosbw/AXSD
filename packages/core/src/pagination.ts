export interface PageRequest { limit?: number; cursor?: string; }
export interface Page<T> { items: readonly T[]; nextCursor?: string; }
export function normalizeLimit(limit?: number, max = 100): number {
  if (limit === undefined) return Math.min(25, max);
  return Math.max(1, Math.min(Math.floor(limit), max));
}
