import type { Budget } from '@axsd/core';

export interface Usage { tokens: number; cost: number; toolCalls: number; elapsedMs: number; steps: number; retries: number }

function finiteNonNegative(value: number): boolean { return Number.isFinite(value) && value >= 0; }

export function enforceBudget(budget: Budget, usage: Usage): { allowed: boolean; exceeded: string[] } {
  const exceeded: string[] = [];
  for (const [key, value] of Object.entries(usage)) if (!finiteNonNegative(value)) exceeded.push(`INVALID_USAGE:${key}`);
  if (budget.tokenLimit !== undefined && usage.tokens >= budget.tokenLimit) exceeded.push('TOKEN_LIMIT');
  if (budget.costLimit !== undefined && usage.cost >= budget.costLimit) exceeded.push('COST_LIMIT');
  if (budget.toolCallLimit !== undefined && usage.toolCalls >= budget.toolCallLimit) exceeded.push('TOOL_CALL_LIMIT');
  if (budget.executionTimeMs !== undefined && usage.elapsedMs >= budget.executionTimeMs) exceeded.push('EXECUTION_TIME_LIMIT');
  if (budget.stepLimit !== undefined && usage.steps >= budget.stepLimit) exceeded.push('STEP_LIMIT');
  if (budget.retryLimit !== undefined && usage.retries >= budget.retryLimit) exceeded.push('RETRY_LIMIT');
  return { allowed: exceeded.length === 0, exceeded: [...new Set(exceeded)] };
}
