export interface RequestContext { requestId:string; userId:string; roles:string[]; sessionId?:string; projectId?:string; }
export function createRequestContext(userId:string,roles:string[],headers:Record<string,string|undefined>):RequestContext{return{requestId:headers['x-request-id']||crypto.randomUUID(),userId,roles,sessionId:headers['x-session-id'],projectId:headers['x-project-id']};}
