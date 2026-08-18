export interface RiskInput{privilege:number;externalImpact:number;reversibility:number;dataSensitivity:number;environment:'LOCAL'|'SANDBOX'|'CONTAINER'|'REMOTE'|'CLOUD';}
export type Risk='LOW'|'MEDIUM'|'HIGH'|'CRITICAL';
export function classifyRisk(i:RiskInput):Risk{const env=i.environment==='CLOUD'||i.environment==='REMOTE'?2:1;const score=i.privilege+i.externalImpact+i.reversibility+i.dataSensitivity+env;if(score>=13)return'CRITICAL';if(score>=9)return'HIGH';if(score>=5)return'MEDIUM';return'LOW';}
