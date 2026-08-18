export type ErrorCode = 'AUTH_ERR' | 'FORBIDDEN' | 'VALIDATION_ERR' | 'NOT_FOUND' | 'CONFLICT' | 'RATE_LIMITED' | 'POLICY_DENIED' | 'APPROVAL_REQUIRED' | 'EXECUTION_ERR' | 'INTERNAL_ERR';

export class ApiError extends Error {
  constructor(public readonly code: ErrorCode, message: string, public readonly statusCode = 500) {
    super(message);
    this.name = 'ApiError';
  }
}