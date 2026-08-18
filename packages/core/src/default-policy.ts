import type { ControlDecision, ControlRequest } from './control-decision.js';

export interface PolicyRule {
  id: string;
  resourceId?: string;
  action?: string;
  effect: ControlDecision['effect'];
  reason: string;
  requiresApproval?: boolean;
}

/** Deny-by-default evaluator. Rules are explicit; unmatched requests are denied. */
export class DeterministicPolicyEngine {
  constructor(private readonly rules: readonly PolicyRule[]) {}

  evaluate(request: ControlRequest): ControlDecision {
    const matches = this.rules.filter((r) =>
      (!r.resourceId || r.resourceId === request.resourceId) &&
      (!r.action || r.action === request.action),
    );
    const rule = matches[0];
    if (!rule) {
      return { effect: 'DENY', reason: 'No matching policy rule', policyIds: [], requiresApproval: false, decidedAt: new Date().toISOString() };
    }
    return {
      effect: rule.effect,
      reason: rule.reason,
      policyIds: [rule.id],
      requiresApproval: rule.requiresApproval ?? rule.effect === 'ASK',
      decidedAt: new Date().toISOString(),
    };
  }
}
