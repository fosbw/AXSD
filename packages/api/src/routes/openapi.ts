import type { FastifyInstance } from 'fastify';
import { openapi } from '../openapi.js';
export function registerOpenApiRoute(app: FastifyInstance): void { app.get('/api/v1/openapi.json', async () => openapi); }