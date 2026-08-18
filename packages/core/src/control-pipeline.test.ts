import { describe, expect, it } from 'vitest';
import { executeControlled, type ControlAudit } from './control-pipeline.js';
import type { ControlRequest } from './control-decision.js';

const request: ControlRequest = {
  actorId: 'user-1', sessionId: 'session-1', projectId: 'project-1',
  resourceId: 'tool-1', action: 'write', risk: 'HIGH', requestedAt: new Date().toISOString(),
};

function audit(events: string[]): ControlAudit {
  return { record: (event) => { events.push(event.type); } };
}

describe('control pipeline', () => {
  it('fails closed on DENY and never invokes the resource', async () => {
    const events: string[] = [];
    let invoked = false;
    await expect(executeControlled(request, {
      policy: { evaluate: () => ({ effect: 'DENY', reason: 'blocked', policyIds: ['p1'], requiresApproval: false, decidedAt: new Date().toISOString() }) },
      budget: { check: () => undefined },
      approval: { waitForApproval: async () => undefined },
      invoker: { invoke: async () => { invoked = true; return 'bad'; } },
      audit: audit(events),
    })).rejects.toThrow('POLICY_DENIED');
    expect(invoked).toBe(false);
    expect(events).toEqual(['policy_denied']);
  });

  it('requires approval before execution', async () => {
    const events: string[] = [];
    const order: string[] = [];
    const result = await executeControlled(request, {
      policy: { evaluate: () => ({ effect: 'ASK', reason: 'high risk', policyIds: ['p1'], requiresApproval: true, decidedAt: new Date().toISOString() }) },
      budget: { check: () => { order.push('budget'); } },
      approval: { waitForApproval: async () => { order.push('approval'); } },
      invoker: { invoke: async () => { order.push('execute'); return 'ok'; } },
      audit: audit(events),
    });
    expect(result).toBe('ok');
    expect(order).toEqual(['budget', 'approval', 'execute']);
  });

  it('fails closed when the budget guard rejects', async () => {
    const events: string[] = [];
    let invoked = false;
    const error = new Error('budget exceeded');
    await expect(executeControlled(request, {
      policy: { evaluate: () => ({ effect: 'ALLOW', reason: 'allowed', policyIds: ['p1'], requiresApproval: false, decidedAt: new Date().toISOString() }) },
      budget: { check: () => { throw error; } },
      approval: { waitForApproval: async () => undefined },
      invoker: { invoke: async () => { invoked = true; return 'bad'; } },
      audit: audit(events),
    })).rejects.toBe(error);
    expect(invoked).toBe(false);
    expect(events).toEqual(['budget_denied']);
  });

  it('fails closed when approval is rejected', async () => {
    const events: string[] = [];
    let invoked = false;
    const error = new Error('approval denied');
    await expect(executeControlled(request, {
      policy: { evaluate: () => ({ effect: 'ASK', reason: 'high risk', policyIds: ['p1'], requiresApproval: true, decidedAt: new Date().toISOString() }) },
      budget: { check: () => undefined },
      approval: { waitForApproval: async () => { throw error; } },
      invoker: { invoke: async () => { invoked = true; return 'bad'; } },
      audit: audit(events),
    })).rejects.toBe(error);
    expect(invoked).toBe(false);
    expect(events).toEqual(['approval_requested', 'approval_failed']);
  });

  it('audits execution errors without swallowing the original error', async () => {
    const events: string[] = [];
    const error = new Error('tool failed');
    await expect(executeControlled(request, {
      policy: { evaluate: () => ({ effect: 'ALLOW', reason: 'allowed', policyIds: ['p1'], requiresApproval: false, decidedAt: new Date().toISOString() }) },
      budget: { check: () => undefined },
      approval: { waitForApproval: async () => undefined },
      invoker: { invoke: async () => { throw error; } },
      audit: audit(events),
    })).rejects.toBe(error);
    expect(events).toEqual(['execution_started', 'execution_failed']);
  });
});
