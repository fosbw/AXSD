import type { ControlRequest } from './control-decision.js';
import { executeControlled, type ApprovalGate, type BudgetGuard, type ControlAudit, type ExecutionInvoker, type PolicyEvaluator } from './control-pipeline.js';

export interface GuardDependencies<T> { policy: PolicyEvaluator; budget: BudgetGuard; approval: ApprovalGate; invoker: ExecutionInvoker<T>; audit: ControlAudit; }

/** Single public entrypoint for resource execution; callers must not invoke adapters directly. */
export async function runThroughControlPlane<T>(request: ControlRequest, deps: GuardDependencies<T>): Promise<T> {
  if (!request.actorId || !request.sessionId || !request.resourceId || !request.action) throw new Error('INVALID_CONTROL_REQUEST');
  if (!Number.isFinite(request.estimatedCost ?? 0) || (request.estimatedCost ?? 0) < 0) throw new Error('INVALID_ESTIMATED_COST');
  return executeControlled(request, deps);
}
