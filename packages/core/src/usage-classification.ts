export type UsageKind='ACTUAL'|'ESTIMATED'|'UNKNOWN';
export interface UsageValue { value:number|null; kind:UsageKind; source?:string; }
export function actualUsage(value:number,source:string):UsageValue{return {value,kind:'ACTUAL',source};}
export function estimatedUsage(value:number,source:string):UsageValue{return {value,kind:'ESTIMATED',source};}
export function unknownUsage():UsageValue{return {value:null,kind:'UNKNOWN'};}
