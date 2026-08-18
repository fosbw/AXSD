import type { Resource } from './domain.js';

export interface CapabilityMatch { resource: Resource; score: number; matchedCapabilities: string[]; }

/** Deterministic capability matching used before policy/risk/budget filtering. */
export function matchCapabilities(resources: Resource[], required: string[]): CapabilityMatch[] {
  const wanted = [...new Set(required.filter(Boolean))];
  if (!wanted.length) return resources.map((resource) => ({ resource, score: 0, matchedCapabilities: [] }));
  return resources
    .map((resource) => {
      const matchedCapabilities = wanted.filter((capability) => resource.capabilities.includes(capability));
      return { resource, matchedCapabilities, score: matchedCapabilities.length / wanted.length };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.resource.id.localeCompare(b.resource.id));
}
