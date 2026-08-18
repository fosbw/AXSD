# Adapter Contract

Adapters are the only provider-specific boundary exposed to the control plane.

## Requirements
- Declare stable adapter identity and version.
- Declare capabilities explicitly.
- Validate configuration before registration.
- Return normalized results and normalized errors.
- Receive only the execution-scoped context and granted capabilities.
- Never mutate policy, identity, approval, budget, or audit authority.
- Mark operations as idempotent/non-idempotent where applicable.
- Support health checks that are safe and read-only.

## Lifecycle
`discover -> validate -> register -> health -> execute -> disconnect`

Provider-specific SDKs belong inside adapters, never in the core domain.
