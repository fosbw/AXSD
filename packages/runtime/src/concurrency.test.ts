import test from 'node:test';
import assert from 'node:assert/strict';
import { ConcurrencyGate, ResourceLock, BudgetLedger } from './index.js';

test('concurrency gate enforces limit and reports capacity', () => {
  const gate = new ConcurrencyGate(1);
  assert.equal(gate.getAvailable(), 1);
  assert.equal(gate.tryAcquire(), true);
  assert.equal(gate.getActive(), 1);
  assert.equal(gate.getAvailable(), 0);
  assert.equal(gate.tryAcquire(), false);
  gate.release();
  assert.equal(gate.getAvailable(), 1);
  assert.equal(gate.tryAcquire(), true);
});

test('concurrency gate rejects non-positive or fractional limits', () => {
  assert.throws(() => new ConcurrencyGate(0), /INVALID_CONCURRENCY/);
  assert.throws(() => new ConcurrencyGate(1.5), /INVALID_CONCURRENCY/);
});

test('resource lock isolates executions', () => {
  const lock = new ResourceLock();
  assert.equal(lock.acquire('r', 'a'), true);
  assert.equal(lock.acquire('r', 'b'), false);
  lock.release('r', 'a');
  assert.equal(lock.acquire('r', 'b'), true);
});

test('budget ledger rejects overage atomically', () => {
  const budget = new BudgetLedger({ tokens: 10 });
  assert.equal(budget.reserve({ tokens: 7 }), true);
  assert.equal(budget.reserve({ tokens: 4 }), false);
  assert.deepEqual(budget.snapshot(), { tokens: 7 });
});
