export type ContentTrust='AUTHORITY'|'UNTRUSTED';
export interface UntrustedContent { source:'MODEL'|'TOOL'|'MCP'|'WEB'|'FILE'; text:string; trust:ContentTrust; }
export function asUntrusted(source:UntrustedContent['source'],text:string):UntrustedContent{return{source,text,trust:'UNTRUSTED'};}
export function canAuthorize(content:UntrustedContent):boolean{return content.trust==='AUTHORITY';}
