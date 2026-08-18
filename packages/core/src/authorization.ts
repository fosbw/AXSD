export type Role = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
export type Permission = 'read' | 'write' | 'approve' | 'execute' | 'admin';
const matrix: Record<Role, ReadonlySet<Permission>> = {
  OWNER: new Set(['read','write','approve','execute','admin']),
  ADMIN: new Set(['read','write','approve','execute','admin']),
  MEMBER: new Set(['read','write','execute']),
  VIEWER: new Set(['read'])
};
export function hasPermission(role: Role, permission: Permission): boolean { return matrix[role].has(permission); }
export function requirePermission(role: Role, permission: Permission): void { if (!hasPermission(role, permission)) throw new Error('FORBIDDEN'); }
