import test from 'node:test';
import assert from 'node:assert/strict';
import { ConcurrencyGate, ResourceLock, BudgetLedger } from './index.js';
test('concurrency gate enforces limit',()=>{const g=new ConcurrencyGate(1);assert.equal(g.tryAcquire(),true);assert.equal(g.tryAcquire(),false);g.release();assert.equal(g.tryAcquire(),true);});
test('resource lock isolates executions',()=>{const l=new ResourceLock();assert.equal(l.acquire('r','a'),true);assert.equal(l.acquire('r','b'),false);l.release('r','a');assert.equal(l.acquire('r','b'),true);});
test('budget ledger rejects overage atomically',()=>{const b=new BudgetLedger({tokens:10});assert.equal(b.reserve({tokens:7}),true);assert.equal(b.reserve({tokens:4}),false);assert.deepEqual(b.snapshot(),{tokens:7});});
