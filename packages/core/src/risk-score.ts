export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export interface RiskInput { privilege: number; externalImpact: number; sensitivity: number; reversibility: number; destructive: boolean; }
export function riskScore(input: RiskInput): number {
  const base = Math.max(0, Math.min(100, input.privilege * 20 + input.externalImpact * 20 + input.sensitivity * 20 + (10 - input.reversibility * 2)));
  return Math.min(100, base + (input.destructive ? 20 : 0));
}
export function riskLevel(score: number): RiskLevel {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 30) return 'MEDIUM';
  return 'LOW';
}
