import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from '../../shared/config/env.js';

export async function buildServer() {
  const app = Fastify({ logger: false });

  await app.register(cors);

  app.get('/health', async () => {
    return {
      status: 'ok',
      env: env.NODE_ENV,
    };
  });

  return app;
}