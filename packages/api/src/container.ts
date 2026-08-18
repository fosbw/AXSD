import { InMemoryAuditRepository, InMemoryResourceRepository } from '@axsd/storage';

export const container = {
  resources: new InMemoryResourceRepository(),
  audit: new InMemoryAuditRepository(),
};