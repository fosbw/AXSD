import { describe, expect, it } from 'vitest';
import { redactSecrets } from './security.js';

describe('redaction', () => { it('redacts secret-like keys', () => { const value = redactSecrets({ apiKey: 'secret-value', nested: { password: 'pw' } }) as Record<string, unknown>; expect(value.apiKey).toBe('[REDACTED]'); expect(value.nested).toEqual({ password: '[REDACTED]' }); }); });