import { InMemoryAuditRepository, InMemoryResourceRepository, PostgresAuditRepository, PostgresExecutionRepository, PostgresResourceRepository, PostgresUserRepository, createPool, type ResourceRepository } from '@axsd/storage';

const pool = process.env.DATABASE_URL ? createPool() : null;
const resources: ResourceRepository = pool ? new PostgresResourceRepository(pool) : new InMemoryResourceRepository();
const users = pool ? new PostgresUserRepository(pool) : null;
const audit = pool ? new PostgresAuditRepository(pool) : new InMemoryAuditRepository();
const executions = pool ? new PostgresExecutionRepository(pool) : null;

export const container = { resources, audit, executions, pool, users };
