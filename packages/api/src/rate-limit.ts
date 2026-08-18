import type { FastifyInstance } from 'fastify';

export function registerRateLimit(app: FastifyInstance, max = 120, windowMs = 60_000): void {
  const buckets = new Map<string, { count: number; resetAt: number }>();
  app.addHook('onRequest', async (request, reply) => {
    const key = request.ip;
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) buckets.set(key, { count: 1, resetAt: now + windowMs });
    else bucket.count++;
    const current = buckets.get(key)!;
    if (current.count > max) { reply.header('Retry-After', Math.ceil((current.resetAt - now) / 1000)); await reply.status(429).send({ error: { code: 'RATE_LIMITED', message: 'Rate limit exceeded' } }); }
  });
}