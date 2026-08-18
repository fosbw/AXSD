import { evaluatePolicies, type PolicyContext, type PolicyRule, type Execution } from '@axsd/core';
import type { CancellationToken } from './cancellation.js';

export interface ExecutionServiceDeps { policies: PolicyRule[]; execute: (execution: Execution, token: CancellationToken) => Promise<unknown>; }

export async function runControlledExecution(execution: Execution, context: PolicyContext, deps: ExecutionServiceDeps, token: CancellationToken): Promise<Execution> {
  const decision = evaluatePolicies(context, deps.policies);
  if (decision.decision === 'DENY' || decision.decision === 'ASK') return { ...execution, status: decision.decision === 'ASK' ? 'WAITING_APPROVAL' : 'FAILED', error: { code: decision.decision === 'ASK' ? 'APPROVAL_REQUIRED' : 'POLICY_DENIED', message: decision.reason } };
  const started = Date.now();
  try { token.throwIfCancelled(); const result = await deps.execute({ ...execution, status: 'RUNNING', startedAt: new Date().toISOString() }, token); token.throwIfCancelled(); return { ...execution, status: 'COMPLETED', startedAt: new Date(started).toISOString(), finishedAt: new Date().toISOString(), durationMs: Date.now() - started, result }; }
  catch (error) { return { ...execution, status: token.cancelled ? 'CANCELLED' : 'FAILED', durationMs: Date.now() - started, error: { code: token.cancelled ? 'EXECUTION_CANCELLED' : 'EXECUTION_ERR', message: error instanceof Error ? error.message : 'Execution failed' } }; }
}