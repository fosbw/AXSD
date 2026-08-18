import type { Resource } from './domain.js';

export interface RoutingRequest { intent: string; requiredCapabilities: string[]; allowedTypes?: Resource['type'][]; }

export function rankCandidates(resources: Resource[], request: RoutingRequest): Resource[] {
  return resources.filter(r => r.status === 'enabled').filter(r => !request.allowedTypes || request.allowedTypes.includes(r.type)).filter(r => request.requiredCapabilities.every(c => r.capabilities.includes(c))).sort((a,b) => Number(b.health === 'healthy') - Number(a.health === 'healthy'));
}