import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  test: {
    environment: 'node',
    include: ['shared/**/*.test.ts', 'api/**/*.test.ts', 'src/**/*.test.ts'],
  },
});
