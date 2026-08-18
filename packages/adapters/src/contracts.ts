import type { Resource, Execution } from '@axsd/core';

export interface AdapterContext { actorId: string; sessionId: string; signal: AbortSignal; metadata?: Record<string, unknown> }
export interface HealthResult { status: 'healthy' | 'degraded' | 'unhealthy'; details?: Record<string, unknown> }
export interface DiscoveryResult { resources: Resource[] }

export interface ResourceAdapter {
  readonly id: string;
  readonly resourceType: Resource['type'];
  discover(context: AdapterContext): Promise<DiscoveryResult>;
  health(resource: Resource, context: AdapterContext): Promise<HealthResult>;
  capabilities(resource: Resource, context: AdapterContext): Promise<string[]>;
  execute(resource: Resource, action: string, args: unknown, context: AdapterContext): Promise<Pick<Execution, 'result' | 'cost' | 'tokens'>>;
}

export interface ModelAdapter extends ResourceAdapter { readonly resourceType: 'model'; }
export interface ToolAdapter extends ResourceAdapter { readonly resourceType: 'tool'; }
export interface AgentAdapter extends ResourceAdapter { readonly resourceType: 'agent'; }
