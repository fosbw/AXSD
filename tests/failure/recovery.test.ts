import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryIdempotencyStore, idempotencyKey, ResourceLock } from '@axsd/runtime';

test('retry key is deterministic', () =>
  assert.equal(idempotencyKey(['execution', 'a', 'step', '1']), idempotencyKey(['execution', 'a', 'step', '1'])));

test('structured idempotency components do not collide through delimiter ambiguity', () => {
  assert.notEqual(idempotencyKey(['ab', 'c']), idempotencyKey(['a', 'bc']));
});

test('resource remains releasable after failure', () => {
  const lock = new ResourceLock();
  assert.equal(lock.acquire('resource', 'execution'), true);
  lock.release('resource', 'execution');
  assert.equal(lock.owner('resource'), undefined);
});

test('idempotency store expires entries', async () => {
  const store = new InMemoryIdempotencyStore();
  await store.put('k', { ok: true }, 1);
  await new Promise(resolve => setTimeout(resolve, 5));
  assert.equal(await store.get('k'), null);
});

test('idempotency store rejects invalid TTL', async () => {
  const store = new InMemoryIdempotencyStore();
  await assert.rejects(() => store.put('k', { ok: true }, 0), /INVALID_IDEMPOTENCY_TTL/);
});
