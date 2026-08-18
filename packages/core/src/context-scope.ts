export interface ContextItem{kind:string;id:string;priority:number;tokens:number;trusted:boolean;content:unknown;}
export function scopeContext(items:ContextItem,maxTokens:number){let used=0;return [...items].sort((a,b)=>b.priority-a.priority||Number(b.trusted)-Number(a.trusted)).filter(x=>{if(used+x.tokens>maxTokens)return false;used+=x.tokens;return true;});}
