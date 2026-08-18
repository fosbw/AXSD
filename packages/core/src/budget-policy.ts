import type { Budget, Execution } from './domain.js';

export interface UsageSnapshot { tokens: number; cost: number; toolCalls: number; elapsedMs: number; steps: number; retries: number; }

export function budgetExceeded(budget: Budget, usage: UsageSnapshot): string[] {
  const exceeded: string[] = [];
  if (budget.tokenLimit !== undefined && usage.tokens > budget.tokenLimit) exceeded.push('tokenLimit');
  if (budget.costLimit !== undefined && usage.cost > budget.costLimit) exceeded.push('costLimit');
  if (budget.toolCallLimit !== undefined && usage.toolCalls > budget.toolCallLimit) exceeded.push('toolCallLimit');
  if (budget.executionTimeMs !== undefined && usage.elapsedMs > budget.executionTimeMs) exceeded.push('executionTimeMs');
  if (budget.stepLimit !== undefined && usage.steps > budget.stepLimit) exceeded.push('stepLimit');
  if (budget.retryLimit !== undefined && usage.retries > budget.retryLimit) exceeded.push('retryLimit');
  return exceeded;
}

export function executionUsage(execution: Execution): UsageSnapshot {
  return { tokens: Object.values(execution.tokens ?? {}).reduce((a, b) => a + b, 0), cost: execution.cost?.amount ?? 0, toolCalls: 0, elapsedMs: execution.durationMs ?? 0, steps: 0, retries: execution.retries };
}