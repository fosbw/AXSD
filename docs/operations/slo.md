# Initial SLO targets

These are deployment targets, not guarantees:

- API availability: 99.9% monthly for a correctly provisioned deployment.
- Readiness detection: dependency failure surfaced within 30 seconds.
- Approval persistence: no acknowledged approval is silently lost.
- Audit durability: committed audit events are append-only and recoverable from the configured database backup.
- Graceful shutdown: stop accepting new work before terminating active workers.

Measure actual performance with the load and failure test suites before publishing an SLO to users.
