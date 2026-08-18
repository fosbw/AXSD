import type { FastifyInstance } from 'fastify';
import { PostgresProjectRepository, createPool } from '@axsd/storage';
type Project = { id: string; ownerId:string; name: string; instructions?: string; status:'ACTIVE'|'ARCHIVED'; createdAt: string };
const memory: Project[] = [];
export function registerProjectRoutes(app: FastifyInstance): void {
  app.get('/api/v1/projects', async (request) => {
    const ownerId=request.principal?.id??'local';
    if(process.env.DATABASE_URL){const pool=createPool();try{return{data:await new PostgresProjectRepository(pool).list(ownerId)}}finally{await pool.end();}}
    return {data:memory.filter(p=>p.ownerId===ownerId)};
  });
  app.post<{Body:{name:string;instructions?:string}}>('/api/v1/projects', async (request, reply) => {
    if (!request.body.name?.trim()) return reply.status(400).send({ error: { code: 'VALIDATION_ERR', message: 'Project name is required' } });
    const ownerId=request.principal?.id??'local';
    const project={id:crypto.randomUUID(),ownerId,name:request.body.name.trim(),instructions:request.body.instructions,status:'ACTIVE' as const,createdAt:new Date().toISOString()};
    if(process.env.DATABASE_URL){const pool=createPool();try{await new PostgresProjectRepository(pool).create(project);return reply.status(201).send({data:project});}finally{await pool.end();}}
    memory.push(project);return reply.status(201).send({data:project});
  });
}
