import type { ExecutionStatus } from '@axsd/core';

const transitions: Record<ExecutionStatus, readonly ExecutionStatus[]> = {
  QUEUED: ['RUNNING', 'CANCELLED'],
  RUNNING: ['WAITING_APPROVAL', 'PAUSED', 'RETRYING', 'FAILED', 'CANCELLED', 'COMPLETED'],
  WAITING_APPROVAL: ['RUNNING', 'CANCELLED', 'PAUSED'],
  PAUSED: ['RUNNING', 'CANCELLED', 'RECOVERING'],
  RETRYING: ['RUNNING', 'FAILED', 'CANCELLED'],
  RECOVERING: ['RUNNING', 'FAILED', 'CANCELLED'],
  FAILED: ['RECOVERING'],
  CANCELLED: [],
  COMPLETED: []
};

export function canTransition(from: ExecutionStatus, to: ExecutionStatus): boolean {
  return transitions[from]?.includes(to) ?? false;
}

export function transition(from: ExecutionStatus, to: ExecutionStatus): ExecutionStatus {
  if (!canTransition(from, to)) throw new Error(`INVALID_EXECUTION_TRANSITION:${from}->${to}`);
  return to;
}

export function isTerminal(status: ExecutionStatus): boolean { return status === 'COMPLETED' || status === 'FAILED' || status === 'CANCELLED'; }
export function allowedTransitions(from: ExecutionStatus): readonly ExecutionStatus[] { return transitions[from] ?? []; }
