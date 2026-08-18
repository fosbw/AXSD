import test from 'node:test';
import assert from 'node:assert/strict';
import { auditDigest } from './audit.js';

test('audit digest changes when event changes', () => { const event = { id: '1', actorId: 'u1', action: 'read', risk: 'LOW', decision: 'ALLOW', timestamp: '2026-01-01T00:00:00Z', metadata: {} }; const a = auditDigest(event); const b = auditDigest({ ...event, action: 'write' }); assert.notEqual(a, b); });