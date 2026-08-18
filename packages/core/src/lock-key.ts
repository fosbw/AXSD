export function executionLockKey(resourceId:string, projectId?:string):string{return `resource:${resourceId}:project:${projectId??'global'}`;}
export function sessionLockKey(sessionId:string):string{return `session:${sessionId}`;}
