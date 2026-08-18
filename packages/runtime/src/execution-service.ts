import { evaluatePolicies, executeControlled, type ControlRequest, type PolicyContext, type PolicyRule, type ControlDecision, type Execution } from '@axsd/core';
import type { CancellationToken } from './cancellation.js';

export interface ExecutionServiceDeps {
  policies: PolicyRule[];
  execute: (execution: Execution, token: CancellationToken) => Promise<unknown>;
  budget?: { check: (request: ControlRequest) => Promise<void> | void };
  approval?: { waitForApproval: (request: ControlRequest, decision: ControlDecision) => Promise<void> };
  audit?: { record: (event: { type: string; request: ControlRequest; decision?: ControlDecision; status: 'accepted' | 'rejected' | 'completed' | 'failed'; error?: { code: string; message: string } }) => Promise<void> | void };
}

function controlRequest(context: PolicyContext): ControlRequest {
  return {
    actorId: context.actorId,
    sessionId: context.sessionId,
    projectId: context.projectId,
    resourceId: context.resourceId,
    action: context.action,
    risk: context.risk,
    requestedAt: context.requestedAt,
  };
}

export async function runControlledExecution(
  execution: Execution,
  context: PolicyContext,
  deps: ExecutionServiceDeps,
  token: CancellationToken,
): Promise<Execution> {
  const request = controlRequest(context);
  const policy = {
    evaluate: () => {
      const result = evaluatePolicies(context, deps.policies);
      return {
        effect: result.decision,
        reason: result.reason,
        policyIds: result.matchedPolicyIds,
        requiresApproval: result.decision === 'ASK',
        decidedAt: result.evaluatedAt,
      } satisfies ControlDecision;
    },
  };

  const budget = deps.budget ?? { check: () => undefined };
  const approval = deps.approval ?? {
    waitForApproval: async () => {
      throw new Error('APPROVAL_REQUIRED: approval gate is not configured');
    },
  };
  const audit = deps.audit ?? { record: async () => undefined };

  try {
    const result = await executeControlled(request, {
      policy,
      budget,
      approval,
      audit,
      invoker: {
        invoke: async () => {
          token.throwIfCancelled();
          const running = { ...execution, status: 'RUNNING' as const, startedAt: new Date().toISOString() };
          const value = await deps.execute(running, token);
          token.throwIfCancelled();
          return value;
        },
      },
    });

    return {
      ...execution,
      status: 'COMPLETED',
      startedAt: execution.startedAt ?? new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      result,
    };
  } catch (error) {
    const cancelled = token.cancelled;
    return {
      ...execution,
      status: cancelled ? 'CANCELLED' : 'FAILED',
      finishedAt: new Date().toISOString(),
      error: {
        code: cancelled ? 'EXECUTION_CANCELLED' : error instanceof Error ? error.message.split(':', 1)[0] : 'EXECUTION_ERR',
        message: error instanceof Error ? error.message : 'Execution failed',
      },
    };
  }
}
