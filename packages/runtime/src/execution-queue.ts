export interface QueueJob<T = unknown> {
  id: string;
  payload: T;
  attempts: number;
  availableAt: number;
}

export interface ExecutionQueue<T = unknown> {
  enqueue(payload: T, delayMs?: number): string;
  dequeue(): QueueJob<T> | null;
  requeue(job: QueueJob<T>, delayMs: number): void;
  size(): number;
}

/** Local/test queue. A durable queue adapter should implement this contract for multi-worker production deployments. */
export class InMemoryExecutionQueue<T = unknown> implements ExecutionQueue<T> {
  private readonly q: QueueJob<T>[] = [];

  enqueue(payload: T, delayMs = 0): string {
    if (!Number.isFinite(delayMs) || delayMs < 0) throw new Error('INVALID_QUEUE_DELAY');
    const job = { id: crypto.randomUUID(), payload, attempts: 0, availableAt: Date.now() + delayMs };
    this.q.push(job);
    return job.id;
  }

  dequeue(): QueueJob<T> | null {
    const index = this.q.findIndex((job) => job.availableAt <= Date.now());
    if (index < 0) return null;
    return this.q.splice(index, 1)[0] ?? null;
  }

  requeue(job: QueueJob<T>, delayMs: number): void {
    if (!Number.isFinite(delayMs) || delayMs < 0) throw new Error('INVALID_QUEUE_DELAY');
    this.q.push({ ...job, attempts: job.attempts + 1, availableAt: Date.now() + delayMs });
  }

  size(): number { return this.q.length; }
}
