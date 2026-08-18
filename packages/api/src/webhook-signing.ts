import { createHmac, timingSafeEqual } from 'node:crypto';
export function signWebhook(body:string,secret:string):string{return createHmac('sha256',secret).update(body).digest('hex');}
export function verifyWebhook(body:string,signature:string,secret:string):boolean{const a=Buffer.from(signWebhook(body,secret),'hex');const b=Buffer.from(signature,'hex');return a.length===b.length&&timingSafeEqual(a,b);}
