export interface ResourceRecord { id: string; name: string; type: string; provider: string; capabilities: string[]; status: string; metadata: Record<string, unknown>; }
export interface AuditRecord { id: string; actorId: string; action: string; resourceId?: string; risk: string; decision: string; timestamp: string; metadata: Record<string, unknown>; }

export interface ResourceRepository { list(): Promise<ResourceRecord[]>; get(id: string): Promise<ResourceRecord | null>; upsert(resource: ResourceRecord): Promise<void>; remove(id: string): Promise<boolean>; }
export interface AuditRepository { append(event: AuditRecord): Promise<void>; list(limit?: number): Promise<AuditRecord[]>; }

export class InMemoryResourceRepository implements ResourceRepository {
  private readonly items = new Map<string, ResourceRecord>();
  async list() { return [...this.items.values()]; }
  async get(id: string) { return this.items.get(id) ?? null; }
  async upsert(resource: ResourceRecord) { this.items.set(resource.id, resource); }
  async remove(id: string) { return this.items.delete(id); }
}

export class InMemoryAuditRepository implements AuditRepository {
  private readonly events: AuditRecord[] = [];
  async append(event: AuditRecord) { this.events.push(event); }
  async list(limit = 100) { return this.events.slice(-limit).reverse(); }
}