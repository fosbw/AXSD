export class ConcurrencyGate {
  private active = 0;

  constructor(private readonly limit: number) {
    if (!Number.isInteger(limit) || limit < 1) throw new Error('INVALID_CONCURRENCY');
  }

  tryAcquire(): boolean {
    if (this.active >= this.limit) return false;
    this.active++;
    return true;
  }

  release(): void {
    if (this.active > 0) this.active--;
  }

  getActive(): number {
    return this.active;
  }

  getLimit(): number {
    return this.limit;
  }

  getAvailable(): number {
    return this.limit - this.active;
  }
}
