import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://www.planacdistribuidora.com';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
    },
    
    // Mobile devices
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'mobile-safari-se',
      use: { ...devices['iPhone SE'] },
    },
    
    // Tablet
    {
      name: 'tablet',
      use: { ...devices['iPad Mini'] },
    },
  ],

  // Screenshot comparison settings
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },
});
