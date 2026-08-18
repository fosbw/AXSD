export interface LoopSignal { kind: 'identical_request' | 'identical_tool_call' | 'repeated_failure' | 'excessive_retry'; key: string; count: number; }

export class LoopDetector {
  private readonly counts = new Map<string, number>();
  constructor(private readonly threshold = 3) {}

  observe(kind: LoopSignal['kind'], key: string): LoopSignal | null {
    const id = `${kind}:${key}`;
    const count = (this.counts.get(id) ?? 0) + 1;
    this.counts.set(id, count);
    return count >= this.threshold ? { kind, key, count } : null;
  }

  reset(): void { this.counts.clear(); }
}