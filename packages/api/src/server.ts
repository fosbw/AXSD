import { buildApp } from './app.js';
import { migrate } from '@axsd/storage';

const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 3000);
const app = buildApp();

try {
  if (process.env.DATABASE_URL) await migrate();
  await app.listen({ host, port });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}

const shutdown = async (signal: string) => { app.log.info({ signal }, 'shutdown requested'); await app.close(); process.exit(0); };
process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));