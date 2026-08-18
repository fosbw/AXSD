# AXSD Production Readiness

This document defines the remaining implementation contract for the control plane.

## Runtime guarantees
- Every execution has an immutable identity and lifecycle state.
- Authorization is evaluated before resource execution.
- Tool/model/plugin output is untrusted data and never becomes authority.
- Cancellation is cooperative first and forceful only at an explicit boundary.
- Retries must be idempotent or explicitly marked non-retryable.
- Budgets are enforced server-side; client/model claims are advisory only.

## Deployment profiles
- Local: single API, web, PostgreSQL.
- Container: API/web/database with health and readiness checks.
- Production: external PostgreSQL, durable secret provider, TLS termination, structured logs, metrics, backups, and isolated workers.

## Required release gates
1. Fresh database migration succeeds.
2. Existing database migration succeeds without destructive migration.
3. Authentication and authorization tests pass.
4. Policy deny/ask/allow tests pass.
5. Approval race tests pass.
6. Budget and concurrency tests pass.
7. Cancellation and recovery tests pass.
8. Audit integrity verification passes.
9. Secret redaction tests pass.
10. E2E execution path passes with a test adapter.

Production deployment must provide real credentials and provider adapters; test adapters are never presented as production integrations.
