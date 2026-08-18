import type { Resource, ResourceType } from './domain.js';

export interface ResourceQuery {
  type?: ResourceType;
  provider?: string;
  status?: Resource['status'];
  health?: Resource['health'];
  tags?: string[];
  search?: string;
}

/** In-process registry; production deployments should back this contract with durable storage. */
export class ResourceRegistry {
  private readonly resources = new Map<string, Resource>();

  register(resource: Resource): Resource {
    if (!resource.id || !resource.name || !resource.adapter) throw new Error('INVALID_RESOURCE');
    const existing = this.resources.get(resource.id);
    if (existing) {
      const merged = { ...existing, ...resource, updatedAt: new Date().toISOString() };
      this.resources.set(resource.id, merged);
      return merged;
    }
    this.resources.set(resource.id, resource);
    return resource;
  }

  get(id: string): Resource | undefined { return this.resources.get(id); }

  remove(id: string): boolean { return this.resources.delete(id); }

  setEnabled(id: string, enabled: boolean): Resource {
    const resource = this.require(id);
    const next = { ...resource, status: enabled ? 'enabled' as const : 'disabled' as const, updatedAt: new Date().toISOString() };
    this.resources.set(id, next);
    return next;
  }

  list(query: ResourceQuery = {}): Resource[] {
    const search = query.search?.trim().toLowerCase();
    return [...this.resources.values()].filter((r) => {
      if (query.type && r.type !== query.type) return false;
      if (query.provider && r.provider !== query.provider) return false;
      if (query.status && r.status !== query.status) return false;
      if (query.health && r.health !== query.health) return false;
      if (search && !`${r.name} ${r.provider} ${r.id}`.toLowerCase().includes(search)) return false;
      if (query.tags?.length) {
        const tags = Array.isArray(r.metadata.tags) ? r.metadata.tags.map(String) : [];
        if (!query.tags.every((tag) => tags.includes(tag))) return false;
      }
      return true;
    });
  }

  touch(id: string, health: Resource['health'] = 'healthy'): Resource {
    const resource = this.require(id);
    const next = { ...resource, health, lastSeen: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.resources.set(id, next);
    return next;
  }

  require(id: string): Resource {
    const resource = this.resources.get(id);
    if (!resource) throw new Error('RESOURCE_NOT_FOUND');
    return resource;
  }
}
