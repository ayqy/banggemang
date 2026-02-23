// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './tests',
  workers: 1,
  timeout: 15_000,
  expect: {
    timeout: 5_000
  },
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:4173',
    headless: true,
    viewport: { width: 1440, height: 900 },
    navigationTimeout: 10_000,
    actionTimeout: 10_000
  }
};

module.exports = config;
