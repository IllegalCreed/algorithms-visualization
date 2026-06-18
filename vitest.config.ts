import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig((env) =>
  mergeConfig(viteConfig(env), {
    test: {
      environment: 'jsdom',
      globals: true,
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{ts,vue}'],
        exclude: ['src/main.ts', 'src/**/*.spec.ts', 'src/vite-env.d.ts'],
        thresholds: { lines: 70, branches: 60, functions: 70, statements: 70 },
      },
    },
  }),
);
