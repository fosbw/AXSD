export interface ExecutionIntent{actorId:string;sessionId:string;projectId?:string;resourceId:string;action:string;environment?:string;argumentsMetadata:Record<string,unknown>;}
export function normalizeIntent(input:ExecutionIntent):ExecutionIntent{return {...input,action:input.action.trim(),argumentsMetadata:input.argumentsMetadata??{}};}
