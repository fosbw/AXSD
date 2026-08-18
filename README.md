# AXSD

**AI eXecution & Safety Director** — a model-, agent-, tool-, provider-, and environment-agnostic control plane for governed AI execution.

> Status: active production-oriented build. Core, runtime, adapter, API, persistence, web console, CLI, container deployment, migrations, and CI foundations are implemented; provider-specific integrations and full production security validation remain release gates.

## Architecture

```text
User / Web / API / CLI
        |
 Identity -> Session -> Project
        |
 Resource Registry -> Capability Routing -> Risk
        |
 Policy -> Permission -> Budget -> Approval
        |
 Execution Runtime -> Isolation -> Checkpoint -> Recovery
        |
 Adapters: Models / Agents / Tools / MCP / APIs / Git / Containers / Cloud
        |
 Audit -> Metrics -> Notifications
```

## Packages

- `packages/core` — domain types, policy evaluation, risk, budgets, routing, authorization and isolation profiles.
- `packages/runtime` — execution states, cancellation, checkpoints, loop detection, kill switch and controlled execution.
- `packages/adapters` — resource/provider contracts, discovery, secret redaction, health and MCP boundaries.
- `packages/storage` — PostgreSQL connection, migrations, resource persistence and tamper-evident audit primitives.
- `packages/api` — versioned Fastify API, resources, sessions, projects, policies, budgets, approvals, executions, audit, discovery and OpenAPI.
- `packages/web` — responsive React control-plane console.
- `packages/cli` — operational command surface.

## Security model

Model output, tool output, MCP responses, files and remote content are untrusted data. They never become policy authority. Permission comes from the control plane. Secrets are represented by references and are not intended for logs or UI display. High-impact operations must pass explicit policy and approval gates.

## Local development

1. Copy `.env.example` to `.env` and provide real local values.
2. Run PostgreSQL or use `docker compose up --build`.
3. Run `pnpm install`.
4. Run `pnpm typecheck`, `pnpm build`, and `pnpm test`.
5. Start API and web with `pnpm dev`.

Never commit credentials. Production deployments must replace the development database password and configure a real authentication/secret provider.

## Release gate

AXSD is not called production-ready merely because it builds. A release requires passing integration/E2E/security/load/recovery testing, a real authentication provider, hardened secret storage, real adapter integrations, operational backups, and a validated deployment/rollback procedure.