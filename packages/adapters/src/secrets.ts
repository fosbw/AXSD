export interface SecretResolver { resolve(reference: string): Promise<string>; }

/**
 * Environment-backed resolver for local deployments. Production secret stores can implement the same contract.
 * References are explicitly allow-listed or must use the AXSD_SECRET_ namespace; arbitrary process.env access is forbidden.
 */
export class EnvironmentSecretResolver implements SecretResolver {
  constructor(private readonly allowedReferences: ReadonlySet<string> = new Set()) {}

  async resolve(reference: string): Promise<string> {
    if (!/^[A-Z][A-Z0-9_]{0,127}$/.test(reference)) throw new Error('INVALID_SECRET_REFERENCE');
    if (!reference.startsWith('AXSD_SECRET_') && !this.allowedReferences.has(reference)) throw new Error('SECRET_REFERENCE_NOT_ALLOWED');
    const value = process.env[reference];
    if (!value) throw new Error(`SECRET_NOT_FOUND:${reference}`);
    return value;
  }
}
