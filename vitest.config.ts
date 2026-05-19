import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    exclude: ['dist/**', 'node_modules/**'],
    setupFiles: ['./vitest.setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['src/modules/contracts/**/*.ts'],
      exclude: ['src/modules/contracts/**/__tests__/**'],
    },
  },
});