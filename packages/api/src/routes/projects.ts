import type { FastifyInstance } from 'fastify';
import { PostgresProjectRepository, createPool } from '@axsd/storage';
type Project = { id: string; ownerId:string; name: string; instructions?: string; status:'ACTIVE'|'ARCHIVED'; createdAt: string };
const memory: Project[] = [];
export function registerProjectRoutes(app: FastifyInstance): void {
  app.get<{Headers:{'x-user-id'?:string}}>('/api/v1/projects', async (request) => {
    const ownerId=request.headers['x-user-id'];
    if(process.env.DATABASE_URL&&ownerId){const pool=createPool();try{return{data:await new PostgresProjectRepository(pool).list(ownerId)}}finally{await pool.end();}}
    return {data:memory};
  });
  app.post<{Headers:{'x-user-id'?:string};Body:{name:string;instructions?:string}}>('/api/v1/projects', async (request, reply) => {
    if (!request.body.name?.trim()) return reply.status(400).send({ error: { code: 'VALIDATION_ERR', message: 'Project name is required' } });
    const ownerId=request.headers['x-user-id'];
    if(process.env.DATABASE_URL&&ownerId){const pool=createPool();try{const project={id:crypto.randomUUID(),ownerId,name:request.body.name.trim(),instructions:request.body.instructions,status:'ACTIVE' as const,createdAt:new Date().toISOString()};await new PostgresProjectRepository(pool).create(project);return reply.status(201).send({data:project});}finally{await pool.end();}}
    const project={id:crypto.randomUUID(),ownerId:ownerId??'local',name:request.body.name.trim(),instructions:request.body.instructions,status:'ACTIVE' as const,createdAt:new Date().toISOString()};memory.push(project);return reply.status(201).send({data:project});
  });
}
