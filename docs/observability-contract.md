# Observability Contract

All managed executions use a correlation ID propagated through API, queue, worker and adapter boundaries.

## Structured fields
- timestamp
- level
- service
- correlation_id
- execution_id
- session_id
- actor_id
- resource_id
- action
- duration_ms
- status
- error_code

## Metrics
Track request latency, execution latency, queue depth, active executions, failures, cancellations, approval wait time, budget rejections and adapter health.

Sensitive arguments and credentials are excluded from logs and metrics labels.
