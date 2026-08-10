import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  use: { baseURL: 'http://localhost:5179' },
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/*.mobile.e2e.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      testMatch: '**/*.mobile.e2e.ts',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'pnpm dev --port 5179',
    url: 'http://localhost:5179',
    reuseExistingServer: !process.env.CI,
  },
});
