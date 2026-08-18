import type { ResourceType } from '@axsd/core';
import type { ResourceAdapter } from './contracts.js';

export class AdapterRegistry {
  private readonly adapters = new Map<string, ResourceAdapter>();
  register(adapter: ResourceAdapter): void { if(!adapter?.id||!adapter.resourceType) throw new Error('INVALID_ADAPTER'); if(this.adapters.has(adapter.id)) throw new Error(`ADAPTER_ALREADY_REGISTERED:${adapter.id}`); this.adapters.set(adapter.id,adapter); }
  get(id:string):ResourceAdapter { const adapter=this.adapters.get(id); if(!adapter) throw new Error(`ADAPTER_NOT_FOUND:${id}`); return adapter; }
  has(id:string):boolean{return this.adapters.has(id);}
  unregister(id:string):boolean{return this.adapters.delete(id);}
  list(type?:ResourceType):ResourceAdapter[]{return[...this.adapters.values()].filter(a=>!type||a.resourceType===type).sort((a,b)=>a.id.localeCompare(b.id));}
  clear():void{this.adapters.clear();}
}
