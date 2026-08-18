import { describe, expect, it } from 'vitest';
import { evaluateBudget } from './budget-enforcer.js';

describe('budget enforcement', () => {
  it('fails closed exactly at a configured hard limit', () => {
    expect(evaluateBudget({ tokenLimit: 100 }, { tokens: 100 })).toEqual({
      action: 'STOP',
      reasons: ['TOKEN_LIMIT'],
    });
  });

  it('checks all configured dimensions', () => {
    const result = evaluateBudget(
      {
        tokenLimit: 100,
        costLimit: 5,
        toolCallLimit: 10,
        executionTimeMs: 1000,
        stepLimit: 20,
        retryLimit: 3,
      },
      { tokens: 100, cost: 5, toolCalls: 10, executionTimeMs: 1000, steps: 20, retries: 3 },
    );

    expect(result.action).toBe('STOP');
    expect(result.reasons).toEqual([
      'TOKEN_LIMIT',
      'COST_LIMIT',
      'TOOL_CALL_LIMIT',
      'TIME_LIMIT',
      'STEP_LIMIT',
      'RETRY_LIMIT',
    ]);
  });

  it('allows execution while every configured limit remains available', () => {
    expect(evaluateBudget({ tokenLimit: 100, stepLimit: 10 }, { tokens: 99, steps: 9 })).toEqual({
      action: 'ALLOW',
      reasons: [],
    });
  });
});
