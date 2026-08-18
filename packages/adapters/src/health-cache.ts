export interface HealthResult{status:'healthy'|'degraded'|'unhealthy';checkedAt:number;}
export class HealthCache{private values=new Map<string,HealthResult>();set(id:string,status:HealthResult['status']){this.values.set(id,{status,checkedAt:Date.now()});}get(id:string,maxAgeMs=30_000){const x=this.values.get(id);return x&&Date.now()-x.checkedAt<=maxAgeMs?x:null;}}
