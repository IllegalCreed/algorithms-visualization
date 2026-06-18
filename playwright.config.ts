import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  use: { baseURL: 'http://localhost:5179' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev --port 5179',
    url: 'http://localhost:5179',
    reuseExistingServer: !process.env.CI,
  },
});
