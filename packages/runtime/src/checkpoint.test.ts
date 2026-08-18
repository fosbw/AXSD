import test from 'node:test';
import assert from 'node:assert/strict';
import { CheckpointStore } from './checkpoint.js';

test('stores and invalidates checkpoints', () => { const store = new CheckpointStore(); store.save({ id: 'c1', executionId: 'e1', phase: 'build', state: { ok: true }, createdAt: new Date().toISOString(), valid: true }); assert.equal(store.get('c1')?.valid, true); assert.equal(store.invalidate('c1'), true); assert.equal(store.get('c1')?.valid, false); });