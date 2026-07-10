import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/analytics.e2e.ts',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:5179' },
    },
    {
      name: 'analytics',
      testMatch: '**/analytics.e2e.ts',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:5180' },
    },
  ],
  webServer: [
    {
      command: 'pnpm dev --port 5179',
      url: 'http://localhost:5179',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm dev --port 5180',
      url: 'http://localhost:5180',
      reuseExistingServer: false,
      env: {
        VITE_ANALYTICS_PROVIDER: 'umami',
        VITE_UMAMI_SCRIPT_URL: 'https://cloud.umami.is/script.js',
        VITE_UMAMI_WEBSITE_ID: '123e4567-e89b-12d3-a456-426614174000',
      },
    },
  ],
});
