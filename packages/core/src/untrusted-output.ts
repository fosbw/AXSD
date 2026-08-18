export interface UntrustedOutput<T = unknown> {
  value: T;
  source: 'MODEL' | 'AGENT' | 'TOOL' | 'MCP' | 'WEB' | 'FILE' | 'REMOTE';
  trustedForAuthority: false;
}

export function markUntrusted<T>(value: T, source: UntrustedOutput<T>['source']): UntrustedOutput<T> {
  return { value, source, trustedForAuthority: false };
}
