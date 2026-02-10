import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  timeout: 120_000,
  retries: 0,
  fullyParallel: false,
  reporter: [["list"], ["html", { outputFolder: "../../artifacts/test-results/playwright-report", open: "never" }]],
  outputDir: "../../artifacts/test-results/test-output",
  use: {
    baseURL: "http://127.0.0.1:8080",
    headless: true,
    channel: "chrome",
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node ../../server/dev-server.mjs",
    url: "http://127.0.0.1:8080/index.html",
    timeout: 120_000,
    reuseExistingServer: true,
  },
});
