import type { FastifyInstance } from 'fastify';

type Project = { id: string; name: string; instructions?: string; createdAt: string };
const projects: Project[] = [];
export function registerProjectRoutes(app: FastifyInstance): void {
  app.get('/api/v1/projects', async () => ({ data: projects }));
  app.post<{ Body: { name: string; instructions?: string } }>('/api/v1/projects', async (request, reply) => {
    if (!request.body.name?.trim()) return reply.status(400).send({ error: { code: 'VALIDATION_ERR', message: 'Project name is required' } });
    const project: Project = { id: crypto.randomUUID(), ...request.body, createdAt: new Date().toISOString() };
    projects.push(project);
    return reply.status(201).send({ data: project });
  });
}