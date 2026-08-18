# AXSD Backup and Restore

## Back up

Back up the PostgreSQL database using the platform's supported database tooling. Store backups encrypted and separately from the primary deployment. Keep retention and access controls appropriate to the data sensitivity.

## Restore

1. Stop new executions.
2. Preserve current logs and audit records.
3. Restore the database into an isolated recovery instance.
4. Validate migrations and integrity constraints.
5. Verify users, projects, policies, budgets, resources, sessions and audit events.
6. Resume execution only after readiness and authorization checks pass.

Execution checkpoints are application state, not a substitute for database backups. External side effects cannot be assumed reversible by restoring database state.
