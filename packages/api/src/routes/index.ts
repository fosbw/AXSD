import type { FastifyInstance } from 'fastify';
import { container } from '../container.js';
import { registerExecutionRoutes } from './executions.js';
import { registerSessionRoutes } from './sessions.js';
import { registerApprovalRoutes } from './approvals.js';
import { registerPolicyRoutes } from './policies.js';
import { registerBudgetRoutes } from './budgets.js';
import { registerProjectRoutes } from './projects.js';
import { registerNotificationRoutes } from './notifications.js';

export function registerDomainRoutes(app: FastifyInstance): void {
  registerExecutionRoutes(app);
  registerSessionRoutes(app);
  registerApprovalRoutes(app);
  registerPolicyRoutes(app);
  registerBudgetRoutes(app);
  registerProjectRoutes(app);
  registerNotificationRoutes(app);
  void container;
}