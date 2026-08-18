# AXSD Threat Model

## Trust boundaries

1. **Control plane boundary** — authentication, authorization, policy, budget and approval decisions are authoritative.
2. **Adapter boundary** — adapters are untrusted extensions and must expose only declared capabilities.
3. **Execution boundary** — tool/model/agent execution occurs behind an explicit runtime boundary.
4. **Data boundary** — model output, tool output, MCP responses, files and remote content are untrusted data.
5. **Secret boundary** — credentials are accessed through a secret-store abstraction and are never part of domain events.

## Primary threats

- Malicious or compromised agent attempting policy bypass.
- Prompt/tool injection attempting to change authority.
- Compromised adapter or MCP server attempting credential access.
- Privilege escalation through ambiguous policy precedence.
- Secret leakage through logs, errors, audit events or UI.
- Replay/double approval and concurrent approval races.
- Budget bypass through retries, subprocesses or recursive execution.
- Supply-chain compromise of plugins/dependencies.
- Data exfiltration through permitted but overly broad tools.
- Interrupted execution causing inconsistent persistent state.

## Required controls

- Explicit deny/ask semantics and deterministic precedence.
- Never infer identity or privilege from model/tool output.
- Least-privilege resource capabilities.
- Approval decisions bound to execution/request identity and expiry/session scope.
- Atomic budget accounting and idempotency keys.
- Secret redaction before logs/audit/UI.
- Adapter trust classification and sandbox boundary for untrusted code.
- Append-only/tamper-evident audit storage.
- Kill switch enforced by the control plane.
- Timeouts, cancellation and bounded retries.

## Security invariant

> No untrusted output can create authority. Authority is derived only from authenticated identity and explicit control-plane policy.
