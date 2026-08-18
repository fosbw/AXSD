import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyRisk, riskAtMost } from './risk.js';

test('classifies low risk', () => assert.equal(classifyRisk({ privilege: 1, reversibility: 1, externalImpact: 1, dataSensitivity: 1 }), 'LOW'));
test('classifies critical risk', () => assert.equal(classifyRisk({ privilege: 4, reversibility: 4, externalImpact: 4, dataSensitivity: 4 }), 'CRITICAL'));
test('compares risk levels', () => assert.equal(riskAtMost('MEDIUM', 'HIGH'), true));