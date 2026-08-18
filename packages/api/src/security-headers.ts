import type {FastifyInstance} from 'fastify';
export function registerSecurityHeaders(app:FastifyInstance){app.addHook('onSend',async(_req,reply)=>{reply.header('x-content-type-options','nosniff');reply.header('x-frame-options','DENY');reply.header('referrer-policy','no-referrer');reply.header('permissions-policy','camera=(),microphone=(),geolocation=()');});}
