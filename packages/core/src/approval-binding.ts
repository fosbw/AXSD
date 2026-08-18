export interface ApprovalBinding {
  approvalId: string;
  executionId: string;
  resourceId: string;
  action: string;
  argumentDigest: string;
  actorId: string;
  expiresAt?: string;
}

export function approvalMatchesExecution(
  approval: ApprovalBinding,
  execution: Omit<ApprovalBinding, 'approvalId' | 'expiresAt'>,
  now = Date.now(),
): boolean {
  return approval.executionId === execution.executionId
    && approval.resourceId === execution.resourceId
    && approval.action === execution.action
    && approval.argumentDigest === execution.argumentDigest
    && approval.actorId === execution.actorId
    && (!approval.expiresAt || Date.parse(approval.expiresAt) > now);
}
