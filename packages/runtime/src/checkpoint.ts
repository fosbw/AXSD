export interface Checkpoint<T = unknown> { id: string; executionId: string; phase: string; state: T; createdAt: string; valid: boolean; }

export class CheckpointStore<T = unknown> {
  private readonly items = new Map<string, Checkpoint<T>>();
  save(checkpoint: Checkpoint<T>): void { this.items.set(checkpoint.id, checkpoint); }
  get(id: string): Checkpoint<T> | undefined { return this.items.get(id); }
  invalidate(id: string): boolean { const item = this.items.get(id); if (!item) return false; item.valid = false; return true; }
  list(executionId: string): Checkpoint<T>[] { return [...this.items.values()].filter((item) => item.executionId === executionId); }
}