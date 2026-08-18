import type { FastifyReply, FastifyRequest } from 'fastify';

export interface Authenticator { authenticate(request: FastifyRequest): Promise<{ id: string; role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER' } | null>; }

export class NoopAuthenticator implements Authenticator {
  async authenticate(_request: FastifyRequest) { return process.env.NODE_ENV === 'test' ? { id: 'test-user', role: 'OWNER' as const } : null; }
}

export async function requireAuth(authenticator: Authenticator, request: FastifyRequest, reply: FastifyReply): Promise<boolean> {
  const principal = await authenticator.authenticate(request);
  if (!principal) { await reply.status(401).send({ error: { code: 'AUTH_ERR', message: 'Authentication required' } }); return false; }
  request.principal = principal;
  return true;
}

declare module 'fastify' { interface FastifyRequest { principal?: { id: string; role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER' }; } }