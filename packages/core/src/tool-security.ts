import { createHash } from 'node:crypto';

export interface ToolDescriptor {
  id: string;
  name: string;
  version?: string;
  capabilities: string[];
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export function fingerprintTool(tool: ToolDescriptor): string {
  const canonical = JSON.stringify({
    id: tool.id,
    name: tool.name,
    version: tool.version ?? null,
    capabilities: [...tool.capabilities].sort(),
    risk: tool.risk,
  });
  return createHash('sha256').update(canonical).digest('hex');
}

export function toolChanged(previousFingerprint: string, tool: ToolDescriptor): boolean {
  return previousFingerprint !== fingerprintTool(tool);
}
