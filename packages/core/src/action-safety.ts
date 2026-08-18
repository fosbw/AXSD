import type {RiskLevel} from './domain.js';
const irreversible=new Set(['delete','destroy','drop','revoke','publish','git_force_push']);
export function classifyAction(action:string,environment?:string):RiskLevel{const a=action.toLowerCase();if(irreversible.has(a)||/production/i.test(environment||''))return 'CRITICAL';if(/write|push|deploy|execute/i.test(a))return 'HIGH';if(/update|create/i.test(a))return 'MEDIUM';return 'LOW';}
