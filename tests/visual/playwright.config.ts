import {defineConfig, devices} from '@playwright/test';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export type Mode = 'ui' | 'wire';
export type TestOptions = {mode: Mode; sizeName: 'mobile' | 'desktop'};

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(here, '..', '..');
const PORT = Number(process.env.PORT || 3000);
export const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

/** Visual + accessibility + keyboard tests at 390×844 and 1440×900, in UI and wireframe mode. */
export default defineConfig<TestOptions>({
  testDir: here,
  outputDir: path.join(here, '..', '..', 'test-results'),
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 3,
  reporter: process.env.CI ? [['github'], ['html', {open: 'never'}]] : [['list']],
  timeout: 90_000,
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {animations: 'disabled', caret: 'hide', maxDiffPixelRatio: 0.01, scale: 'css'},
  },
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
    colorScheme: 'light',
    locale: 'en-US',
    timezoneId: 'America/Chicago',
    launchOptions: process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : undefined,
  },
  projects: [
    {name: 'mobile-ui', use: {...devices['Desktop Chrome'], viewport: {width: 390, height: 844}, deviceScaleFactor: 1, isMobile: true, hasTouch: true, mode: 'ui', sizeName: 'mobile'}},
    {name: 'mobile-wire', use: {...devices['Desktop Chrome'], viewport: {width: 390, height: 844}, deviceScaleFactor: 1, isMobile: true, hasTouch: true, mode: 'wire', sizeName: 'mobile'}},
    {name: 'desktop-ui', use: {...devices['Desktop Chrome'], viewport: {width: 1440, height: 900}, deviceScaleFactor: 1, mode: 'ui', sizeName: 'desktop'}},
    {name: 'desktop-wire', use: {...devices['Desktop Chrome'], viewport: {width: 1440, height: 900}, deviceScaleFactor: 1, mode: 'wire', sizeName: 'desktop'}},
  ],
  webServer: [
    {
      command: 'npm run preview',
      cwd: repoRoot,
      url: BASE_URL,
      reuseExistingServer: true,
      timeout: 240_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      // Static Storybook for the story matrix (builds it when missing)
      command: 'node tools/dev/static.mjs storybook-static 6007',
      cwd: repoRoot,
      url: 'http://localhost:6007/index.json',
      reuseExistingServer: true,
      timeout: 300_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
  ],
});
