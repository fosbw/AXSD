import type { PermissionDecision, RiskLevel } from './domain.js';

export interface ApprovalRequest { id: string; requestedBy: string; agentId?: string; modelId?: string; resourceId: string; action: string; argumentsMetadata?: Record<string, unknown>; risk: RiskLevel; estimatedCost?: number; decision: PermissionDecision; createdAt: string; }

export function requiresApproval(decision: PermissionDecision): boolean { return decision === 'ASK'; }
