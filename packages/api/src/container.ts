import { InMemoryAuditRepository, InMemoryResourceRepository, PostgresAuditRepository, PostgresExecutionRepository, PostgresResourceRepository, PostgresUserRepository, createPool, type ResourceRepository } from '@axsd/storage';
import { DiscoveryRegistry } from '@axsd/adapters';

const pool = process.env.DATABASE_URL ? createPool() : null;
const resources: ResourceRepository = pool ? new PostgresResourceRepository(pool) : new InMemoryResourceRepository();
const users = pool ? new PostgresUserRepository(pool) : null;
const audit = pool ? new PostgresAuditRepository(pool) : new InMemoryAuditRepository();
const executions = pool ? new PostgresExecutionRepository(pool) : null;
const discovery = new DiscoveryRegistry();

export const container = { resources, audit, executions, discovery, pool, users };
