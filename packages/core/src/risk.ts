import type { RiskLevel } from './domain.js';

const rank: Record<RiskLevel, number> = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };

export interface RiskInput { privilege: number; reversibility: number; externalImpact: number; dataSensitivity: number; }

export function classifyRisk(input: RiskInput): RiskLevel {
  const score = input.privilege + input.reversibility + input.externalImpact + input.dataSensitivity;
  if (score >= 14) return 'CRITICAL';
  if (score >= 10) return 'HIGH';
  if (score >= 6) return 'MEDIUM';
  return 'LOW';
}

export function riskAtMost(actual: RiskLevel, maximum: RiskLevel): boolean { return rank[actual] <= rank[maximum]; }
