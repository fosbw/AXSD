export interface ExecutionTelemetry {
  executionId: string;
  sessionId: string;
  operation: 'model' | 'agent' | 'execute_tool' | 'workflow';
  resourceId?: string;
  modelId?: string;
  agentId?: string;
  durationMs?: number;
  inputTokens?: number;
  outputTokens?: number;
  cachedTokens?: number;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
}

/** Stable internal shape aligned with OpenTelemetry GenAI concepts without coupling the core to an SDK. */
export function toGenAiAttributes(event: ExecutionTelemetry): Record<string, string | number> {
  const attrs: Record<string, string | number> = {
    'gen_ai.operation.name': event.operation,
    'gen_ai.conversation.id': event.sessionId,
    'axsd.execution.id': event.executionId,
    'axsd.execution.status': event.status,
  };
  if (event.resourceId) attrs['axsd.resource.id'] = event.resourceId;
  if (event.modelId) attrs['gen_ai.request.model'] = event.modelId;
  if (event.agentId) attrs['gen_ai.agent.id'] = event.agentId;
  if (event.durationMs !== undefined) attrs['axsd.execution.duration_ms'] = event.durationMs;
  if (event.inputTokens !== undefined) attrs['gen_ai.usage.input_tokens'] = event.inputTokens;
  if (event.outputTokens !== undefined) attrs['gen_ai.usage.output_tokens'] = event.outputTokens;
  if (event.cachedTokens !== undefined) attrs['gen_ai.usage.cached_tokens'] = event.cachedTokens;
  return attrs;
}
