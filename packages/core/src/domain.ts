export type ResourceType = 'model' | 'agent' | 'tool' | 'mcp' | 'api' | 'environment' | 'container' | 'git' | 'cloud' | 'plugin';
export type PermissionDecision = 'ALLOW' | 'DENY' | 'ASK' | 'ALLOW_ONCE' | 'ALLOW_SESSION' | 'ALLOW_RESOURCE';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ExecutionStatus = 'QUEUED' | 'RUNNING' | 'WAITING_APPROVAL' | 'PAUSED' | 'RETRYING' | 'FAILED' | 'CANCELLED' | 'COMPLETED' | 'RECOVERING';

export interface Resource {
  id: string; name: string; type: ResourceType; provider: string; version?: string;
  capabilities: string[]; status: 'enabled' | 'disabled' | 'disconnected';
  health: 'unknown' | 'healthy' | 'degraded' | 'unhealthy'; source: string;
  adapter: string; metadata: Record<string, unknown>; createdAt: string; updatedAt: string; lastSeen?: string;
}

export interface ActionRequest {
  id: string; actorId: string; projectId?: string; sessionId: string;
  resourceId: string; action: string; argumentsMetadata?: Record<string, unknown>;
  environment?: string; requestedAt: string;
}

export interface PolicyRule {
  id: string; name: string; effect: PermissionDecision;
  actorIds?: string[]; projectIds?: string[]; resourceIds?: string[];
  actions?: string[]; environments?: string[]; riskAtMost?: RiskLevel;
  priority: number; enabled: boolean;
}

export interface PolicyDecision {
  decision: PermissionDecision; reason: string; matchedPolicyIds: string[];
  evaluatedAt: string;
}

export interface Budget {
  tokenLimit?: number; costLimit?: number; toolCallLimit?: number;
  executionTimeMs?: number; stepLimit?: number; retryLimit?: number;
}

export interface Execution {
  id: string; request: ActionRequest; status: ExecutionStatus;
  startedAt?: string; finishedAt?: string; durationMs?: number;
  retries: number; checkpointId?: string; cost?: { kind: 'actual' | 'estimated' | 'unknown'; amount?: number; currency?: string };
  tokens?: Record<string, number>; result?: unknown; error?: { code: string; message: string };
}
