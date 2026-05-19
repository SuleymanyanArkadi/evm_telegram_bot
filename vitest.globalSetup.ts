import { execSync } from 'node:child_process';
import dotenv from 'dotenv';

export async function setup(): Promise<void> {
  dotenv.config();

  const testDatabaseUrl = process.env.TEST_DATABASE_URL?.trim();
  if (!testDatabaseUrl) {
    return;
  }

  console.log('\n[test:global] Applying migrations to test database...');
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: testDatabaseUrl },
    stdio: 'pipe',
  });
  console.log('[test:global] Schema ready.\n');
}

export async function teardown(): Promise<void> {
  // data cleanup is handled in integration tests afterAll
}
