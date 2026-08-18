import { InMemoryAuditRepository, InMemoryResourceRepository, PostgresResourceRepository, PostgresUserRepository, createPool, type ResourceRepository } from '@axsd/storage';

const pool = process.env.DATABASE_URL ? createPool() : null;
const resources: ResourceRepository = pool ? new PostgresResourceRepository(pool) : new InMemoryResourceRepository();
const users = pool ? new PostgresUserRepository(pool) : null;

export const container = { resources, audit: new InMemoryAuditRepository(), pool, users };