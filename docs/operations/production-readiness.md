# Production readiness gate

AXSD is production-ready only when all gates below are green:

- migrations apply cleanly to an empty and existing database
- authentication is enabled and `AUTH_DISABLED` is not used
- secrets are supplied through an external secret/configuration mechanism
- readiness fails when required dependencies are unavailable
- policy, approval, budget and kill-switch paths have automated tests
- integration and E2E suites pass against isolated test resources
- backup and restore are exercised, not merely documented
- logs contain no credentials or raw secret-bearing arguments
- rate limits and concurrency limits are configured for deployment
- image/dependency scanning and TypeScript tests pass
- rollback procedure and data migration compatibility are documented

A green checklist is a release criterion, not a marketing claim.
