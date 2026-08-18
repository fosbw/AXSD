# Execution Contract

Every managed action follows this lifecycle:

`REQUESTED -> AUTHENTICATED -> AUTHORIZED -> QUEUED -> RUNNING -> (WAITING_APPROVAL|PAUSED|RETRYING) -> COMPLETED|FAILED|CANCELLED`

Rules:

1. Authorization is evaluated before execution.
2. Approval is required before an action whose decision is ASK.
3. A cancelled execution cannot silently transition back to RUNNING.
4. Retries require an idempotency strategy or an explicit non-idempotent retry policy.
5. Budget checks happen before work and at provider/tool usage boundaries when usage is available.
6. Workers must re-check emergency stop and lease ownership at safe interruption points.
7. Results are recorded with status, duration, usage metadata, and a correlation ID.
8. Provider errors are normalized into stable platform error categories without leaking credentials or internal stack traces.
