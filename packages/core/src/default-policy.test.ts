import { describe, expect, it } from 'vitest';
import { DeterministicPolicyEngine } from './default-policy.js';

describe('DeterministicPolicyEngine', () => {
  it('denies unmatched actions', () => {
    const engine = new DeterministicPolicyEngine([]);
    expect(engine.evaluate({ actorId: 'u', sessionId: 's', resourceId: 'r', action: 'write', risk: 'HIGH', requestedAt: new Date().toISOString() }).effect).toBe('DENY');
  });
  it('returns only an explicit matching rule', () => {
    const engine = new DeterministicPolicyEngine([{ id: 'p1', resourceId: 'r', action: 'read', effect: 'ALLOW', reason: 'read-only' }]);
    expect(engine.evaluate({ actorId: 'u', sessionId: 's', resourceId: 'r', action: 'read', risk: 'LOW', requestedAt: new Date().toISOString() }).effect).toBe('ALLOW');
    expect(engine.evaluate({ actorId: 'u', sessionId: 's', resourceId: 'r', action: 'write', risk: 'HIGH', requestedAt: new Date().toISOString() }).effect).toBe('DENY');
  });
});
