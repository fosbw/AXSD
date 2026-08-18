import { requiresExplicitApproval, type ControlDecision, type ControlRequest } from './control-decision.js';

export interface PolicyEvaluator {
  evaluate(request: ControlRequest): Promise<ControlDecision> | ControlDecision;
}

export interface BudgetGuard {
  check(request: ControlRequest): Promise<void> | void;
}

export interface ApprovalGate {
  waitForApproval(request: ControlRequest, decision: ControlDecision): Promise<void>;
}

export interface ExecutionInvoker<T> {
  invoke(request: ControlRequest): Promise<T>;
}

export interface ControlAudit {
  record(event: {
    type: string;
    request: ControlRequest;
    decision?: ControlDecision;
    status: 'accepted' | 'rejected' | 'completed' | 'failed';
    error?: { code: string; message: string };
  }): Promise<void> | void;
}

function errorMetadata(error: unknown): { code: string; message: string } {
  if (error instanceof Error) {
    return { code: 'EXECUTION_GUARD_ERROR', message: error.message };
  }
  return { code: 'EXECUTION_GUARD_ERROR', message: 'Unknown execution guard failure' };
}

/**
 * Deterministic enforcement boundary: the model/agent proposes; this pipeline decides and executes.
 * Guard failures are audited and execution never starts unless policy, budget and approval gates pass.
 */
export async function executeControlled<T>(
  request: ControlRequest,
  deps: {
    policy: PolicyEvaluator;
    budget: BudgetGuard;
    approval: ApprovalGate;
    invoker: ExecutionInvoker<T>;
    audit: ControlAudit;
  },
): Promise<T> {
  const decision = await deps.policy.evaluate(request);

  if (decision.effect === 'DENY') {
    await deps.audit.record({ type: 'policy_denied', request, decision, status: 'rejected' });
    throw new Error(`POLICY_DENIED: ${decision.reason}`);
  }

  try {
    await deps.budget.check(request);
  } catch (error) {
    await deps.audit.record({
      type: 'budget_denied',
      request,
      decision,
      status: 'rejected',
      error: errorMetadata(error),
    });
    throw error;
  }

  if (requiresExplicitApproval(decision)) {
    await deps.audit.record({ type: 'approval_requested', request, decision, status: 'accepted' });
    try {
      await deps.approval.waitForApproval(request, decision);
    } catch (error) {
      await deps.audit.record({
        type: 'approval_failed',
        request,
        decision,
        status: 'rejected',
        error: errorMetadata(error),
      });
      throw error;
    }
  }

  await deps.audit.record({ type: 'execution_started', request, decision, status: 'accepted' });
  try {
    const result = await deps.invoker.invoke(request);
    await deps.audit.record({ type: 'execution_completed', request, decision, status: 'completed' });
    return result;
  } catch (error) {
    await deps.audit.record({
      type: 'execution_failed',
      request,
      decision,
      status: 'failed',
      error: errorMetadata(error),
    });
    throw error;
  }
}
