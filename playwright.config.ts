import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  // Только e2e/: иначе дефолтный testMatch зацепит src/**/*.test.tsx, которые
  // прогоняет Vitest.
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // Иначе зависший прогон убивается раннером без отчёта.
  globalTimeout: 10 * 60 * 1000,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Локально — dev-сервер; в CI сначала `yarn build`, затем production-сервер,
    // как советует официальный гайд Next.js по Playwright.
    command: process.env.CI ? "yarn start" : "yarn dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
