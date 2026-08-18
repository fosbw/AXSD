import type { Budget } from './domain.js';

export interface UsageSnapshot {
  tokens?: number;
  cost?: number;
  toolCalls?: number;
  executionTimeMs?: number;
  steps?: number;
  retries?: number;
}

export type BudgetAction = 'STOP' | 'PAUSE' | 'ASK' | 'ALLOW';

/**
 * Evaluate hard server-side limits. A limit is exhausted when usage reaches it;
 * this prevents the next externally visible action from crossing the configured ceiling.
 */
export function evaluateBudget(
  budget: Budget,
  usage: UsageSnapshot,
): { action: BudgetAction; reasons: string[] } {
  const reasons: string[] = [];
  if (budget.tokenLimit !== undefined && (usage.tokens ?? 0) >= budget.tokenLimit) reasons.push('TOKEN_LIMIT');
  if (budget.costLimit !== undefined && (usage.cost ?? 0) >= budget.costLimit) reasons.push('COST_LIMIT');
  if (budget.toolCallLimit !== undefined && (usage.toolCalls ?? 0) >= budget.toolCallLimit) reasons.push('TOOL_CALL_LIMIT');
  if (budget.executionTimeMs !== undefined && (usage.executionTimeMs ?? 0) >= budget.executionTimeMs) reasons.push('TIME_LIMIT');
  if (budget.stepLimit !== undefined && (usage.steps ?? 0) >= budget.stepLimit) reasons.push('STEP_LIMIT');
  if (budget.retryLimit !== undefined && (usage.retries ?? 0) >= budget.retryLimit) reasons.push('RETRY_LIMIT');
  return { action: reasons.length ? 'STOP' : 'ALLOW', reasons };
}
