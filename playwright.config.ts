import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Add your custom playwright configuration here
  testDir: './tests',
  timeout: 30000,
});
