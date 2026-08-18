import { createHash } from 'node:crypto';
import type { AuditRecord } from './repositories.js';

export function auditDigest(event: AuditRecord, previousDigest = ''): string {
  const payload = JSON.stringify({ previousDigest, event });
  return createHash('sha256').update(payload).digest('hex');
}

export interface IntegrityEvent extends AuditRecord { digest: string; previousDigest?: string; }
