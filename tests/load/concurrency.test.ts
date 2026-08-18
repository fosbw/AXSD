import test from 'node:test';
import assert from 'node:assert/strict';
import { ConcurrencyGate } from '@axsd/runtime';
test('load fixture enforces bounded concurrency',()=>{const gate=new ConcurrencyGate(8);let admitted=0;for(let i=0;i<100;i++)if(gate.tryAcquire())admitted++;assert.equal(admitted,8);for(let i=0;i<8;i++)gate.release();assert.equal(gate.getActive(),0);});
