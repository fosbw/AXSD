export type DecisionEffect = 'ALLOW' | 'DENY' | 'ASK' | 'ALLOW_ONCE' | 'ALLOW_SESSION' | 'ALLOW_RESOURCE';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ControlRequest {
  actorId: string;
  sessionId: string;
  projectId?: string;
  resourceId: string;
  action: string;
  risk: RiskLevel;
  estimatedCost?: number;
  requestedAt: string;
}

export interface ControlDecision {
  effect: DecisionEffect;
  reason: string;
  policyIds: string[];
  requiresApproval: boolean;
  decidedAt: string;
}

export function requiresExplicitApproval(decision: ControlDecision): boolean {
  return decision.requiresApproval || decision.effect === 'ASK';
}
