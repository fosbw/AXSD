# AXSD

**AI eXecution & Safety Director** — a model-, agent-, tool-, provider-, and environment-agnostic control plane for AI execution.

> Status: foundation build in progress. The repository is being implemented as a production-oriented platform, not a UI-only demo.

## Architecture

```text
User / API / CLI
       |
       v
Identity -> Session -> Intent
       |
       v
Resource Registry -> Capability Matching
       |
       v
Policy -> Permission -> Risk -> Budget -> Approval
       |
       v
Execution Runtime -> Checkpoints -> Recovery
       |
       +---- Adapters: Models / Agents / Tools / MCP / APIs / Git / Containers / Cloud
       |
       v
Audit + Metrics + Notifications
```

## Core guarantees

- Model/provider agnostic core
- Explicit authority boundary: model and tool output are untrusted input
- Central policy and permission decisions
- Approval gates for risky operations
- Persistent execution state and checkpoints
- Token/cost/tool-call/time/step budgets
- Structured audit events without secrets
- Adapter-based integrations
- Local-first deployment with container/cloud options
- Testable core with fake providers isolated to tests

## Repository layout

```text
apps/
  api/                 API and control-plane service
  web/                 Web console
packages/
  core/                Domain types and deterministic control logic
  adapters/            Provider/resource adapter contracts
  policy/              Policy, permission and risk evaluation
  runtime/             Execution state machine and budget enforcement
  audit/               Append-only audit abstractions
  db/                  Persistence schema and migrations
  cli/                 Operational CLI
infra/
  docker/              Container/deployment assets
docs/
  architecture/        Architecture and threat-model documentation
tests/
  fixtures/             Test-only providers and fixtures
```

## Security model

AXSD never treats model output, tool output, MCP responses, files, or remote content as authority. Authority comes from authenticated identity plus the control-plane policy decision. Secrets are represented through a secret-store abstraction and must never be written to application logs.

High-impact actions are deny/ask by policy unless explicitly permitted. Emergency stop is designed as a control-plane operation rather than an instruction sent to an agent.

## Development

The initial repository uses a pnpm workspace. Copy `.env.example` to `.env` for local development; never commit real credentials.

This project is licensed separately from its source-control visibility. Until a license is explicitly selected, no additional permissions beyond applicable copyright law should be assumed.
