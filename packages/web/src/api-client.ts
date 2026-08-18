export async function api<T>(path:string,init:RequestInit={}){const res=await fetch(path,{...init,headers:{'content-type':'application/json',...(init.headers||{})}});const body=await res.json().catch(()=>null);if(!res.ok)throw new Error(body?.error?.code||`HTTP_${res.status}`);return body as T;}
export const listResources=()=>api<{data:unknown[];meta?:unknown}>('/api/v1/resources');
export const listApprovals=()=>api<{data:unknown[]}>('/api/v1/approvals');
export const listNotifications=()=>api<{data:unknown[]}>('/api/v1/notifications');
export const decideApproval=(id:string,decision:'APPROVE_ONCE'|'APPROVE_SESSION'|'DENY'|'CANCEL')=>api(`/api/v1/approvals/${encodeURIComponent(id)}/decision`,{method:'POST',body:JSON.stringify({decision})});
export const stopExecution=(id:string)=>api(`/api/v1/executions/${encodeURIComponent(id)}/stop`,{method:'POST'});
