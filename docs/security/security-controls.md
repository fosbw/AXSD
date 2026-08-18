# Security controls

## Authority
Only authenticated user identity and control-plane policy decisions are authoritative. Model, agent, tool, MCP, file, web and remote responses are untrusted.

## High-impact actions
High/critical risk defaults to deny or explicit approval. Approval records include actor, execution, action, decision and timestamp.

## Secrets
Secrets are never accepted from model output as authority and must not be logged. Providers receive credentials through an adapter/secret boundary.

## Isolation
Execution boundaries must be explicit. A container is not automatically a security boundary for every workload; deployments must select an appropriate sandbox or remote boundary for the threat model.

## Supply chain
Third-party adapters/plugins require explicit trust and should run with minimal permissions. Dependency and image scanning are release gates.
