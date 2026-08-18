export type CancellationMode = 'graceful' | 'forced';

export interface CancellationToken { readonly cancelled: boolean; readonly mode?: CancellationMode; throwIfCancelled(): void; }

export class ExecutionCancellation implements CancellationToken {
  private _cancelled = false;
  private _mode: CancellationMode | undefined;
  get cancelled(): boolean { return this._cancelled; }
  get mode(): CancellationMode | undefined { return this._mode; }
  cancel(mode: CancellationMode): void {
    if (this._cancelled) return;
    this._mode = mode;
    this._cancelled = true;
  }
  throwIfCancelled(): void { if (this._cancelled) throw new Error(`EXECUTION_CANCELLED:${this._mode}`); }
}
