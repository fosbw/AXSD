import type { Resource, Execution } from '@axsd/core';
import type { ResourceAdapter, AdapterContext } from '@axsd/adapters';

export async function executeViaAdapter(adapter: ResourceAdapter, resource: Resource, execution: Execution, context: AdapterContext): Promise<Execution> {
  context.signal.throwIfAborted();
  const result = await adapter.execute(resource, execution.request.action, execution.request.argumentsMetadata ?? {}, context);
  return { ...execution, result: result.result, cost: result.cost, tokens: result.tokens };
}