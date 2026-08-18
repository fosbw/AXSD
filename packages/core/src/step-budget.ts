export function assertStepBudget(steps:number, limit:number):void{if(limit>=0&&steps>=limit)throw new Error('EXECUTION_STEP_BUDGET_EXCEEDED');}
export function nextStep(steps:number):number{return Math.max(0,steps)+1;}
