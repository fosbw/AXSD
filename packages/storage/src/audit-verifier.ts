import { createHash } from 'node:crypto';

export interface AuditChainItem {
  eventId: string;
  actorId: string;
  action: string;
  executionId?: string;
  resourceId?: string;
  metadata: Record<string, unknown>;
  integrityHash: string;
  previousHash: string;
}

/** Verifies the exact canonical payload written by PostgresAuditRepository. */
export function verifyAuditChain(items: AuditChainItem[]): { valid: boolean; brokenAt?: number } {
  let previous = '';
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item.previousHash !== previous) return { valid: false, brokenAt: i };
    const payload = JSON.stringify({
      previous,
      eventId: item.eventId,
      actorId: item.actorId,
      action: item.action,
      executionId: item.executionId,
      resourceId: item.resourceId,
      metadata: item.metadata,
    });
    const expected = createHash('sha256').update(payload).digest('hex');
    if (expected !== item.integrityHash) return { valid: false, brokenAt: i };
    previous = item.integrityHash;
  }
  return { valid: true };
}
