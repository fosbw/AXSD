import type { RiskLevel } from './domain.js';
const rank: Record<RiskLevel, number> = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
export interface RiskInput { privilege:number; reversibility:number; externalImpact:number; dataSensitivity:number; }
export function riskScore(input:RiskInput):number { const raw=input.privilege+input.reversibility+input.externalImpact+input.dataSensitivity; return Math.max(0,Math.min(100,Math.round(raw/20*100))); }
export function classifyRisk(input:RiskInput):RiskLevel { const score=riskScore(input); if(score>=85)return 'CRITICAL'; if(score>=65)return 'HIGH'; if(score>=35)return 'MEDIUM'; return 'LOW'; }
export function riskAtMost(actual:RiskLevel, maximum:RiskLevel):boolean{return rank[actual]<=rank[maximum];}
