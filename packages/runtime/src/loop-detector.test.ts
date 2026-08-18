import test from 'node:test';
import assert from 'node:assert/strict';
import { LoopDetector } from './loop-detector.js';

test('signals repeated calls at threshold', () => { const detector = new LoopDetector(2); assert.equal(detector.observe('identical_tool_call', 'x'), null); assert.equal(detector.observe('identical_tool_call', 'x')?.count, 2); });