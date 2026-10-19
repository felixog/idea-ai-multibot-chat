import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  outputDir: 'test-results',
  use: {
    // BASE_URL runs the suite against a deployment instead of the local preview.
    baseURL: process.env.BASE_URL ?? 'http://localhost:4173',
    launchOptions: { executablePath: process.env.PW_CHROMIUM ?? '/opt/pw-browsers/chromium' },
  },
  webServer: process.env.BASE_URL ? undefined : { command: 'npm run preview', url: 'http://localhost:4173', reuseExistingServer: true },
});
