import { executeControlled, type ControlRequest, type PolicyEvaluator, type ControlDecision, type PolicyContext, type PolicyRule, type Execution } from '@axsd/core';
import type { CancellationToken } from './cancellation.js';

export interface ExecutionServiceDeps {
  policies: PolicyRule[];
  execute: (execution: Execution, token: CancellationToken) => Promise<unknown>;
  budget?: { check: (request: ControlRequest) => Promise<void> | void };
  approval?: { waitForApproval: (request: ControlRequest, decision: ControlDecision) => Promise<void> };
  audit?: { record: (event: { type: string; request: ControlRequest; decision?: ControlDecision; status: 'accepted' | 'rejected' | 'completed' | 'failed'; error?: { code: string; message: string } }) => Promise<void> | void };
}

function controlRequest(execution: Execution, context: PolicyContext): ControlRequest {
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
  const request = controlRequest(execution, context);
  const policy: PolicyEvaluator = {
    evaluate: () => {
      const decision = deps.policies
        .filter((rule) => rule.enabled)
        .sort((a, b) => b.priority - a.priority)[0];
      if (!decision) {
        return { effect: 'DENY', reason: 'No applicable policy grants this action', policyIds: [], requiresApproval: false, decidedAt: new Date().toISOString() };
      }
      const effect = decision.effect;
      return {
        effect,
        reason: effect === 'DENY' ? `Denied by policy ${decision.name}` : `Decision from policy ${decision.name}`,
        policyIds: [decision.id],
        requiresApproval: effect === 'ASK',
        decidedAt: new Date().toISOString(),
      };
    },
  };

  const budget = deps.budget ?? { check: () => undefined };
  const approval = deps.approval ?? { waitForApproval: async () => { throw new Error('APPROVAL_REQUIRED: approval gate is not configured'); } };
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
