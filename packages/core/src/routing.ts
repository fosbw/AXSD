import type { Resource } from './domain.js';
import { matchCapabilities } from './capability-registry.js';

export interface RoutingRequest { intent: string; requiredCapabilities: string[]; allowedTypes?: Resource['type'][]; }

/** Candidate routing only; policy, permission, risk and budget decisions remain authoritative gates. */
export function rankCandidates(resources: Resource[], request: RoutingRequest): Resource[] {
  const eligible = resources
    .filter((resource) => resource.status === 'enabled')
    .filter((resource) => !request.allowedTypes || request.allowedTypes.includes(resource.type));

  return matchCapabilities(eligible, request.requiredCapabilities)
    .sort((a, b) => {
      const healthDelta = Number(b.resource.health === 'healthy') - Number(a.resource.health === 'healthy');
      return healthDelta || b.score - a.score || a.resource.id.localeCompare(b.resource.id);
    })
    .map((candidate) => candidate.resource);
}
