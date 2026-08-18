export interface RetryPolicy { maxAttempts: number; baseDelayMs: number; maxDelayMs: number; retryable: (errorCode: string) => boolean; }
export function backoffDelay(policy: RetryPolicy, attempt: number): number {
  const exponent = Math.max(0, attempt - 1);
  return Math.min(policy.maxDelayMs, policy.baseDelayMs * (2 ** exponent));
}
export function canRetry(policy: RetryPolicy, attempt: number, errorCode: string): boolean {
  return attempt < policy.maxAttempts && policy.retryable(errorCode);
}
