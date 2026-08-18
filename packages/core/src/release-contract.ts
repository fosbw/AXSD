export type ReleaseGateStatus = 'PENDING' | 'PASS' | 'FAIL';

export interface ReleaseGate {
  id: string;
  description: string;
  status: ReleaseGateStatus;
  evidence?: string;
}

export const REQUIRED_RELEASE_GATES: readonly ReleaseGate[] = [
  { id: 'fresh-migrations', description: 'Fresh database migrations succeed', status: 'PENDING' },
  { id: 'authz', description: 'Authentication and authorization tests pass', status: 'PENDING' },
  { id: 'policy', description: 'Policy decisions are deterministic', status: 'PENDING' },
  { id: 'approval-races', description: 'Concurrent approval decisions are safe', status: 'PENDING' },
  { id: 'budget', description: 'Budget limits are enforced server-side', status: 'PENDING' },
  { id: 'recovery', description: 'Cancellation and recovery behavior is validated', status: 'PENDING' },
  { id: 'audit', description: 'Audit integrity can be verified', status: 'PENDING' },
  { id: 'secrets', description: 'Secrets are excluded from logs and UI payloads', status: 'PENDING' },
  { id: 'e2e', description: 'End-to-end execution path passes with a test adapter', status: 'PENDING' },
] as const;

export function isReleaseReady(gates: readonly ReleaseGate[]): boolean {
  return gates.length > 0 && gates.every((gate) => gate.status === 'PASS');
}
