import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  outputDir: 'test-results',
  use: {
    baseURL: 'http://localhost:4173',
    launchOptions: { executablePath: process.env.PW_CHROMIUM ?? '/opt/pw-browsers/chromium' },
  },
  webServer: { command: 'npm run preview', url: 'http://localhost:4173', reuseExistingServer: true },
});
