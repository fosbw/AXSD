export interface BudgetSnapshot {
  tokenUsed: number;
  tokenLimit?: number;
  costUsed: number;
  costLimit?: number;
  toolCalls: number;
  toolCallLimit?: number;
  steps: number;
  stepLimit?: number;
  elapsedMs?: number;
  executionTimeMs?: number;
  retries?: number;
  retryLimit?: number;
}

/** Hard-limit guard used immediately before externally visible work. */
export function budgetExceeded(b: BudgetSnapshot): boolean {
  return (b.tokenLimit !== undefined && b.tokenUsed >= b.tokenLimit)
    || (b.costLimit !== undefined && b.costUsed >= b.costLimit)
    || (b.toolCallLimit !== undefined && b.toolCalls >= b.toolCallLimit)
    || (b.stepLimit !== undefined && b.steps >= b.stepLimit)
    || (b.executionTimeMs !== undefined && (b.elapsedMs ?? 0) >= b.executionTimeMs)
    || (b.retryLimit !== undefined && (b.retries ?? 0) >= b.retryLimit);
}
