import { createHash } from 'node:crypto';

export interface ToolDefinitionFingerprint {
  toolId: string;
  fingerprint: string;
  algorithm: 'sha256';
  createdAt: string;
}

export function fingerprintToolDefinition(toolId: string, definition: unknown): ToolDefinitionFingerprint {
  const canonical = JSON.stringify(definition, Object.keys((definition && typeof definition === 'object') ? definition as object : {}).sort());
  return {
    toolId,
    fingerprint: createHash('sha256').update(canonical).digest('hex'),
    algorithm: 'sha256',
    createdAt: new Date().toISOString(),
  };
}

export function toolDefinitionChanged(expected: string, definition: unknown): boolean {
  const canonical = JSON.stringify(definition, Object.keys((definition && typeof definition === 'object') ? definition as object : {}).sort());
  return createHash('sha256').update(canonical).digest('hex') !== expected;
}
