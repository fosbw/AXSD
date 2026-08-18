export async function withTimeout<T>(work: Promise<T>, ms: number, signal?: AbortSignal): Promise<T> {
  if (!Number.isFinite(ms) || ms <= 0) throw new Error('INVALID_TIMEOUT');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort, { once: true });
  try {
    return await Promise.race([
      work,
      new Promise<T>((_, reject) => controller.signal.addEventListener('abort', () => reject(new Error(signal?.aborted ? 'EXECUTION_CANCELLED' : 'EXECUTION_TIMEOUT')), { once: true })),
    ]);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}
