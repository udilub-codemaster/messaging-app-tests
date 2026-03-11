# Messaging App Tests

Playwright tests for the CommBox messaging app. This repo shows how to run tests locally and how they run in CI.

## Prerequisites

- **Node.js** (LTS)
- Install dependencies: `npm ci` (or `npm install`)

The tests start the app automatically via Playwright’s `webServer` (serves `app` on port 3000). You don’t need to start the app yourself.

## Running tests locally

| What you want        | Command                      |
|----------------------|------------------------------|
| **All tests**        | `npm test`                   |
| **Sanity only**      | `npm run test:sanity`        |
| **Full regression**  | `npm run test:full-regression` |

- **Sanity** = a small set of critical-path tests (fast run). Use this when you want quick feedback locally; it is not run in CI.
- **Full regression** = the full suite (all tests). This is what runs in CI.

## What runs in CI (GitHub Actions)

On every **push** or **pull request** to `main` or `master`, a single job runs:

- **Full regression**  
  - Command: `npx playwright test --project=full-regression`  
  - Uses Chromium only.  
  - Timeout: 60 minutes.

The **Playwright HTML report** and **test results** are always uploaded as workflow artifacts. You can download them from the run summary in the Actions tab.

## Where things live

- Tests: `tests/`
- Config: `playwright.config.ts`
- CI workflow: `.github/workflows/playwright.yml`

Test suites are defined by tags (e.g. `@sanity`, `@full-regression`) and run via the projects `sanity` and `full-regression` in the config.
