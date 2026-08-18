export interface UsageDelta { tokens?: number; cost?: number; toolCalls?: number; steps?: number; durationMs?: number; }
export interface BudgetLimits { tokens?: number; cost?: number; toolCalls?: number; steps?: number; durationMs?: number; }

type BudgetKey = keyof UsageDelta;
const KEYS: readonly BudgetKey[] = ['tokens','cost','toolCalls','steps','durationMs'];

function validNumber(value: number | undefined): boolean { return value === undefined || Number.isFinite(value) && value >= 0; }

export class BudgetLedger {
  private readonly usage: UsageDelta = {};
  constructor(private readonly limits: BudgetLimits) {
    for (const key of KEYS) if (!validNumber(limits[key])) throw new Error(`INVALID_BUDGET_LIMIT:${key}`);
  }

  reserve(delta: UsageDelta): boolean {
    for (const key of KEYS) {
      const value = delta[key];
      if (!validNumber(value)) throw new Error(`INVALID_BUDGET_DELTA:${key}`);
      if (value === undefined) continue;
      const next = (this.usage[key] ?? 0) + value;
      const limit = this.limits[key];
      if (limit !== undefined && next > limit) return false;
    }
    for (const key of KEYS) if (delta[key] !== undefined) this.usage[key] = (this.usage[key] ?? 0) + delta[key]!;
    return true;
  }

  snapshot(): UsageDelta { return { ...this.usage }; }
  remaining(): UsageDelta {
    const result: UsageDelta = {};
    for (const key of KEYS) if (this.limits[key] !== undefined) result[key] = Math.max(0, this.limits[key]! - (this.usage[key] ?? 0));
    return result;
  }
}
