# Backup and restore

## Backup

Use `scripts/backup-postgres.sh` against the production `DATABASE_URL`. Store the resulting custom-format dump in encrypted, access-controlled storage with a documented retention policy. Never back up plaintext secrets.

## Restore

1. Provision an isolated PostgreSQL instance.
2. Restore with `pg_restore --clean --if-exists --no-owner --no-privileges <dump> | psql <DATABASE_URL>` (or use `pg_restore` directly for the target database).
3. Run all migrations; they must be idempotent and already-applied versions must be skipped.
4. Start AXSD with production authentication enabled.
5. Verify users, projects, policies, resources, approvals and audit integrity.
6. Keep executions paused until validation is complete.
7. Resume only after readiness and security checks pass.

Perform restore drills regularly and record recovery time and data-loss results.
