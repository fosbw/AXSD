import { evaluatePolicies, type PolicyContext } from '@axsd/core';
import type { PolicyRule, Execution } from '@axsd/core';
import { ExecutionCancellation } from './cancellation.js';

export interface ExecutionServiceDeps { policies: PolicyRule[]; execute: (execution: Execution, signal: AbortSignal) => Promise<unknown>; }

export async function runControlledExecution(execution: Execution, context: PolicyContext, deps: ExecutionServiceDeps): Promise<Execution> {
  const decision = evaluatePolicies(context, deps.policies);
  if (decision.decision === 'DENY' || decision.decision === 'ASK') return { ...execution, status: decision.decision === 'ASK' ? 'WAITING_APPROVAL' : 'FAILED', error: { code: decision.decision === 'ASK' ? 'APPROVAL_REQUIRED' : 'POLICY_DENIED', message: decision.reason } };
  const cancellation = new ExecutionCancellation();
  const started = Date.now();
  try { const result = await deps.execute({ ...execution, status: 'RUNNING', startedAt: new Date().toISOString() }, cancellation as AbortSignal); return { ...execution, status: 'COMPLETED', startedAt: new Date(started).toISOString(), finishedAt: new Date().toISOString(), durationMs: Date.now() - started, result }; }
  catch (error) { return { ...execution, status: cancellation.cancelled ? 'CANCELLED' : 'FAILED', durationMs: Date.now() - started, error: { code: 'EXECUTION_ERR', message: error instanceof Error ? error.message : 'Execution failed' } }; }
}