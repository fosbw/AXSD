export type ErrorCode =
  | 'AUTH_ERR'
  | 'FORBIDDEN'
  | 'VALIDATION_ERR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'POLICY_DENIED'
  | 'APPROVAL_REQUIRED'
  | 'BUDGET_EXCEEDED'
  | 'KILL_SWITCH_ACTIVE'
  | 'EXECUTION_CANCELLED'
  | 'EXECUTION_TIMEOUT'
  | 'RESOURCE_UNAVAILABLE'
  | 'IDEMPOTENCY_CONFLICT'
  | 'EXECUTION_ERR'
  | 'INTERNAL_ERR';

export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode = 500,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
