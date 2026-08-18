import { describe, expect, it } from 'vitest';
import { CheckpointStore } from './checkpoint.js';

describe('checkpoints', () => { it('stores and invalidates', () => { const store = new CheckpointStore(); store.save({ id: 'c1', executionId: 'e1', phase: 'build', state: { ok: true }, createdAt: new Date().toISOString(), valid: true }); expect(store.get('c1')?.valid).toBe(true); expect(store.invalidate('c1')).toBe(true); expect(store.get('c1')?.valid).toBe(false); }); });