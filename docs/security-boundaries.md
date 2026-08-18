# AXSD Security Boundaries

## Authority
The control plane is authoritative for identity, permissions, policy, budgets, approvals, and emergency stop. Model output, agent output, tool output, MCP responses, repository content, and remote responses are untrusted input.

## Adapter boundary
Adapters expose declared capabilities and receive a constrained execution context. An adapter must not receive credentials or capabilities that were not explicitly granted to the execution.

## Plugin boundary
Third-party extensions are untrusted by default. Production deployments should isolate plugins in a separate process/container when they require arbitrary code execution.

## Credential boundary
Secrets are resolved only at execution time, are never part of normal audit payloads, and must be redacted from error messages and telemetry.

## Environment boundary
A resource cannot expand its own environment scope. Access to a new environment, filesystem scope, network destination, or privileged operation requires a separate policy decision.

## Approval boundary
Approval decisions are bound to the exact execution, resource, action, and session. A model or tool cannot manufacture an approval token.

## Emergency stop
The kill switch is a control-plane operation and must be checked by workers before starting a new externally visible action and at safe interruption boundaries.
