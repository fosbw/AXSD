import type { FastifyRequest } from 'fastify';
import { PostgresApiKeyRepository, PostgresUserRepository } from '@axsd/storage';
import { authenticateApiKey } from './api-key-auth.js';

export class DatabaseAuthenticator {
  constructor(private readonly keys: PostgresApiKeyRepository, private readonly users: PostgresUserRepository) {}
  async authenticate(request: FastifyRequest) { const identity = await authenticateApiKey(request, this.keys); if (!identity) return null; return await this.users.get(identity.id); }
}