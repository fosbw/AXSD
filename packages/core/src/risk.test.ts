import { describe, expect, it } from 'vitest';
import { classifyRisk, riskAtMost } from './risk.js';

describe('risk', () => { it('classifies low risk', () => expect(classifyRisk({ privilege: 1, reversibility: 1, externalImpact: 1, dataSensitivity: 1 })).toBe('LOW')); it('classifies critical risk', () => expect(classifyRisk({ privilege: 4, reversibility: 4, externalImpact: 4, dataSensitivity: 4 })).toBe('CRITICAL')); it('compares levels', () => expect(riskAtMost('MEDIUM', 'HIGH')).toBe(true)); });