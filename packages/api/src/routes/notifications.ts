import type { FastifyInstance } from 'fastify';

type Notification = { id: string; kind: string; message: string; read: boolean; createdAt: string };
const notifications: Notification[] = [];
export function registerNotificationRoutes(app: FastifyInstance): void {
  app.get('/api/v1/notifications', async () => ({ data: notifications }));
  app.post<{ Body: { kind: string; message: string } }>('/api/v1/notifications', async (request, reply) => {
    const notification: Notification = { id: crypto.randomUUID(), kind: request.body.kind, message: request.body.message, read: false, createdAt: new Date().toISOString() };
    notifications.push(notification);
    return reply.status(201).send({ data: notification });
  });
}