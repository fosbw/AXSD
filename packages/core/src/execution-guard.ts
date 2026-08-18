export interface ExecutionGuardInput {
  cancelled: boolean;
  killSwitch: boolean;
  budgetExceeded: boolean;
  leaseOwned: boolean;
}

export type ExecutionGuardResult =
  | { allowed: true }
  | { allowed: false; reason: 'CANCELLED' | 'KILL_SWITCH' | 'BUDGET_EXCEEDED' | 'LEASE_LOST' };

/** Fail closed before an externally visible action. */
export function guardExecution(input: ExecutionGuardInput): ExecutionGuardResult {
  if (input.killSwitch) return { allowed: false, reason: 'KILL_SWITCH' };
  if (input.cancelled) return { allowed: false, reason: 'CANCELLED' };
  if (input.budgetExceeded) return { allowed: false, reason: 'BUDGET_EXCEEDED' };
  if (!input.leaseOwned) return { allowed: false, reason: 'LEASE_LOST' };
  return { allowed: true };
}
