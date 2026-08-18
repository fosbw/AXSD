export interface Capability { name: string; risk?: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'; tags?: string[] }
export interface CapabilityRequirement { name: string; required?: boolean; weight?: number }
export function matchesCapabilities(available: readonly Capability[], required: readonly CapabilityRequirement[]): boolean { const set=new Set(available.map(x=>x.name)); return required.every(r=>!r.required || set.has(r.name)); }
export function rankCapabilities(available: readonly Capability[], required: readonly CapabilityRequirement[]): Capability[] { const weights=new Map(required.map(r=>[r.name,r.weight??1])); return [...available].sort((a,b)=>(weights.get(b.name)??0)-(weights.get(a.name)??0)); }
