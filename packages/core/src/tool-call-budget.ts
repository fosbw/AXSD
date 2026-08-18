export function assertToolCallBudget(calls:number, limit:number):void{if(limit>=0&&calls>=limit)throw new Error('TOOL_CALL_BUDGET_EXCEEDED');}
export function incrementToolCalls(calls:number):number{return Math.max(0,calls)+1;}
