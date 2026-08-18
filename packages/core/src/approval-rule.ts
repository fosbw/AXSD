import type {PermissionDecision,RiskLevel} from './domain.js';
const rank:Record<RiskLevel,number>={LOW:1,MEDIUM:2,HIGH:3,CRITICAL:4};
export function approvalRequired(risk:RiskLevel,decision:PermissionDecision):boolean{return decision==='ASK'||rank[risk]>=3;}
