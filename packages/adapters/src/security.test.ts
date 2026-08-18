import test from 'node:test';
import assert from 'node:assert/strict';
import { redactSecrets } from './security.js';

test('redacts secret-like keys', () => { const value = redactSecrets({ apiKey: 'secret-value', nested: { password: 'pw' } }) as Record<string, unknown>; assert.equal(value.apiKey, '[REDACTED]'); assert.deepEqual(value.nested, { password: '[REDACTED]' }); });