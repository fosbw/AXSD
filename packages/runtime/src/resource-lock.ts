export class ResourceLock {
  private readonly owners = new Map<string, string>();

  acquire(resourceId: string, executionId: string): boolean {
    if (!resourceId || !executionId) throw new Error('INVALID_LOCK_KEY');
    const owner = this.owners.get(resourceId);
    if (owner && owner !== executionId) return false;
    this.owners.set(resourceId, executionId);
    return true;
  }

  release(resourceId: string, executionId: string): void {
    if (this.owners.get(resourceId) === executionId) this.owners.delete(resourceId);
  }

  owner(resourceId: string): string | undefined { return this.owners.get(resourceId); }

  isLocked(resourceId: string): boolean { return this.owners.has(resourceId); }
}
