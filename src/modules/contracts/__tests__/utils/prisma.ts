import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

export interface TestPrismaContext {
  prisma: PrismaClient;
  pool: pg.Pool;
}

export function createTestPrismaContext(databaseUrl: string): TestPrismaContext {
  const pool = new pg.Pool({
    connectionString: databaseUrl,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  return { prisma, pool };
}

export async function resetTestDatabase(prisma: PrismaClient): Promise<void> {
  await prisma.userContract.deleteMany();
  await prisma.user.deleteMany();
}

export async function closeTestPrismaContext(context: TestPrismaContext): Promise<void> {
  await context.prisma.$disconnect();
  await context.pool.end();
}
