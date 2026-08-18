export interface BudgetSnapshot {
  tokenUsed: number;
  tokenLimit?: number;
  costUsed: number;
  costLimit?: number;
  toolCalls: number;
  toolCallLimit?: number;
  steps: number;
  stepLimit?: number;
}

export function budgetExceeded(b: BudgetSnapshot): boolean {
  return (b.tokenLimit !== undefined && b.tokenUsed >= b.tokenLimit)
    || (b.costLimit !== undefined && b.costUsed >= b.costLimit)
    || (b.toolCallLimit !== undefined && b.toolCalls >= b.toolCallLimit)
    || (b.stepLimit !== undefined && b.steps >= b.stepLimit);
}
