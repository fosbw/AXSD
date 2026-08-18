export function remainingTime(deadlineMs:number, now=Date.now()):number{return Math.max(0,deadlineMs-now);}
export function assertTimeBudget(deadlineMs:number, now=Date.now()):void{if(now>=deadlineMs)throw new Error('EXECUTION_TIME_BUDGET_EXCEEDED');}
