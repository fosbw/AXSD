import { createHash, randomBytes } from 'node:crypto';
import type { FastifyRequest } from 'fastify';
import type { PostgresApiKeyRepository } from '@axsd/storage';

export function hashApiKey(key: string): string { return createHash('sha256').update(key).digest('hex'); }
export function generateApiKey(): string { return `axsd_${randomBytes(32).toString('base64url')}`; }

export async function authenticateApiKey(request: FastifyRequest, repository: PostgresApiKeyRepository) {
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  const record = await repository.findActiveByHash(hashApiKey(header.slice(7).trim()));
  if (!record) return null;
  return { id: record.userId, role: 'MEMBER' as const };
}