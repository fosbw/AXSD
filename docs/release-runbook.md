# AXSD Release Runbook

1. Set production secrets through the deployment secret provider; never commit them.
2. Create a database backup before migrations.
3. Run database migrations against a staging copy.
4. Start API and workers with readiness checks enabled.
5. Verify authentication, authorization, policy evaluation, approvals, budgets, cancellation and audit integrity.
6. Run the end-to-end test adapter workflow.
7. Verify metrics, structured logs and health endpoints.
8. Perform a controlled rollout.
9. Monitor execution failure rate, latency, queue depth, resource errors and budget enforcement.
10. If a release is unsafe, stop new executions, preserve audit state, restore the last known-good application version, and follow the documented database recovery procedure.

## Rollback principle
Application rollback and database rollback are separate operations. Never assume a database migration is reversible. Prefer forward-compatible migrations and restore from a verified backup when data recovery is required.
