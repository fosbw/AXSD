# Plugin Trust Model

Plugins are untrusted by default.

A plugin may expose metadata and capabilities only after registration and validation. Arbitrary code execution requires an explicit deployment trust boundary, preferably a separate process/container with a reduced filesystem, network and credential scope.

Plugins cannot:
- change policies;
- grant permissions;
- approve executions;
- disable the kill switch;
- read unrelated secrets;
- rewrite audit history;
- expand their environment scope.

Plugin crashes must be isolated from the control plane and reported as normalized resource failures.
