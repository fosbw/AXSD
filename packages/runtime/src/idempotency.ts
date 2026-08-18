import { createHash } from 'node:crypto';
export function idempotencyKey(parts:string[]):string{return createHash('sha256').update(parts.join('\x1f')).digest('hex');}
export interface IdempotencyStore { get(key:string):Promise<unknown|null>; put(key:string,value:unknown,ttlMs:number):Promise<void>; }
export class InMemoryIdempotencyStore implements IdempotencyStore { private m=new Map<string,{v:unknown;expires:number}>(); async get(k:string){const x=this.m.get(k);if(!x)return null;if(x.expires<Date.now()){this.m.delete(k);return null;}return x.v;} async put(k:string,v:unknown,ttlMs:number){this.m.set(k,{v,expires:Date.now()+ttlMs});} }
