export type CancellationMode = 'graceful' | 'forced';

export interface CancellationToken { readonly cancelled: boolean; readonly mode?: CancellationMode; throwIfCancelled(): void; }

export class ExecutionCancellation implements CancellationToken {
  cancelled = false;
  mode: CancellationMode | undefined;
  cancel(mode: CancellationMode): void { this.mode = mode; this.cancelled = true; }
  throwIfCancelled(): void { if (this.cancelled) throw new Error(`EXECUTION_CANCELLED:${this.mode}`); }
}