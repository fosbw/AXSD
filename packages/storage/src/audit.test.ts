import { describe, expect, it } from 'vitest';
import { auditDigest } from './audit.js';

describe('audit digest', () => { it('changes when event changes', () => { const event = { id: '1', actorId: 'u1', action: 'read', risk: 'LOW', decision: 'ALLOW', timestamp: '2026-01-01T00:00:00Z', metadata: {} }; expect(auditDigest(event)).not.toBe(auditDigest({ ...event, action: 'write' })); }); });