import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryIdempotencyStore, idempotencyKey, ResourceLock } from '@axsd/runtime';
test('retry key is deterministic',()=>assert.equal(idempotencyKey(['execution','a','step','1']),idempotencyKey(['execution','a','step','1'])));
test('resource remains releasable after failure',()=>{const l=new ResourceLock();assert.equal(l.acquire('resource','execution'),true);l.release('resource','execution');assert.equal(l.owner('resource'),undefined);});
test('idempotency store expires entries',async()=>{const s=new InMemoryIdempotencyStore();await s.put('k',{ok:true},1);await new Promise(r=>setTimeout(r,5));assert.equal(await s.get('k'),null);});
