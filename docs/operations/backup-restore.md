# Backup and restore

Back up PostgreSQL data and the deployment configuration needed to reconstruct the control plane. Never back up plaintext secrets. Test restores on an isolated environment on a defined schedule. Restore order: database, configuration references, services, then validate policies/resources/audit integrity before resuming executions.