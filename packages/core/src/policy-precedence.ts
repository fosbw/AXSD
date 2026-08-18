import type { PolicyRule, PermissionDecision } from './domain.js';

/** Higher scope wins; within a scope DENY is fail-closed. Explicit priorities remain a tiebreaker. */
const effectRank: Record<PermissionDecision, number> = {
  DENY: 0,
  ASK: 1,
  ALLOW_ONCE: 2,
  ALLOW_SESSION: 3,
  ALLOW_RESOURCE: 4,
  ALLOW: 5,
};

export type PolicyScope = 'global' | 'user' | 'project' | 'agent' | 'resource' | 'session';
const scopeRank: Record<PolicyScope, number> = {
  global: 0,
  user: 1,
  project: 2,
  agent: 3,
  resource: 4,
  session: 5,
};

export interface ScopedPolicyRule extends PolicyRule { scope?: PolicyScope }

export function resolvePolicies(rules: ScopedPolicyRule[]): { decision: PermissionDecision; matched: string[] } {
  const active = rules.filter(rule => rule.enabled && Number.isFinite(rule.priority));
  if (active.length === 0) return { decision: 'DENY', matched: [] };

  const maxScope = Math.max(...active.map(rule => scopeRank[rule.scope ?? 'global']));
  const scoped = active.filter(rule => scopeRank[rule.scope ?? 'global'] === maxScope);
  const maxPriority = Math.max(...scoped.map(rule => rule.priority));
  const same = scoped.filter(rule => rule.priority === maxPriority);
  const matched = same.map(rule => rule.id);

  // Never let an allow at the same effective scope override an explicit deny.
  if (same.some(rule => rule.effect === 'DENY')) return { decision: 'DENY', matched };

  const chosen = [...same].sort((a, b) => effectRank[a.effect] - effectRank[b.effect])[0];
  return { decision: chosen?.effect ?? 'DENY', matched };
}
