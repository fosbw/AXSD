import type { ActionRequest, PolicyDecision, PolicyRule, RiskLevel } from './domain.js';

const riskRank: Record<RiskLevel, number> = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 };

export interface PolicyContext extends ActionRequest { risk: RiskLevel }

/** Deterministic policy evaluation. Explicit DENY wins over every allow/ask at the same scope. */
export function evaluatePolicies(context: PolicyContext, rules: PolicyRule[], now = new Date().toISOString()): PolicyDecision {
  const applicable = rules.filter(r => r.enabled && matches(r, context));
  if (applicable.length === 0) return { decision: 'DENY', reason: 'No applicable policy grants this action', matchedPolicyIds: [], evaluatedAt: now };
  applicable.sort((a, b) => b.priority - a.priority);
  const topPriority = applicable[0].priority;
  const top = applicable.filter(r => r.priority === topPriority);
  const deny = top.find(r => r.effect === 'DENY');
  if (deny) return { decision: 'DENY', reason: `Denied by policy ${deny.name}`, matchedPolicyIds: top.map(r => r.id), evaluatedAt: now };
  const ask = top.find(r => r.effect === 'ASK');
  if (ask) return { decision: 'ASK', reason: `Approval required by policy ${ask.name}`, matchedPolicyIds: top.map(r => r.id), evaluatedAt: now };
  const grant = top.find(r => ['ALLOW', 'ALLOW_ONCE', 'ALLOW_SESSION', 'ALLOW_RESOURCE'].includes(r.effect));
  if (!grant) return { decision: 'DENY', reason: 'No explicit grant', matchedPolicyIds: top.map(r => r.id), evaluatedAt: now };
  return { decision: grant.effect, reason: `Allowed by policy ${grant.name}`, matchedPolicyIds: top.map(r => r.id), evaluatedAt: now };
}

function matches(rule: PolicyRule, context: PolicyContext): boolean {
  if (rule.actorIds && !rule.actorIds.includes(context.actorId)) return false;
  if (rule.projectIds && (!context.projectId || !rule.projectIds.includes(context.projectId))) return false;
  if (rule.resourceIds && !rule.resourceIds.includes(context.resourceId)) return false;
  if (rule.actions && !rule.actions.includes(context.action)) return false;
  if (rule.environments && (!context.environment || !rule.environments.includes(context.environment))) return false;
  if (rule.riskAtMost && riskRank[context.risk] > riskRank[rule.riskAtMost]) return false;
  return true;
}
