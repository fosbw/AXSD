export type Role = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
export interface Principal { id: string; role: Role; permissions: ReadonlySet<string>; }

export function hasPermission(principal: Principal, permission: string): boolean {
  if (principal.role === 'OWNER') return true;
  return principal.permissions.has(permission);
}

export function assertPermission(principal: Principal, permission: string): void {
  if (!hasPermission(principal, permission)) throw new Error(`FORBIDDEN:${permission}`);
}