export interface CapabilityResource { id: string; capabilities: readonly string[]; enabled?: boolean; }
export interface CapabilityQuery { required: readonly string[]; preferred?: readonly string[]; }
export function matchesCapabilities(resource: CapabilityResource, query: CapabilityQuery): boolean {
  if (resource.enabled === false) return false;
  const set = new Set(resource.capabilities);
  return query.required.every((capability) => set.has(capability));
}
export function rankCapabilities(resource: CapabilityResource, query: CapabilityQuery): number {
  if (!matchesCapabilities(resource, query)) return -1;
  const set = new Set(resource.capabilities);
  return (query.preferred ?? []).reduce((score, capability) => score + (set.has(capability) ? 1 : 0), 0);
}
