# Messaging App Tests

Playwright tests for a simple messaging app (static HTML). This repo automates a realistic messaging flow with API mocking and runs in GitHub Actions CI.

## Prerequisites

- **Node.js** (LTS)
- Install dependencies: `npm ci` (or `npm install`)

The app under test is the static file `app/dummy-messaging-app.html`. Tests start it automatically via Playwright’s `webServer` (serves `app` on port 3000). You don’t need to start the app yourself.

## Setup & running tests locally

| What you want        | Command                      |
|----------------------|------------------------------|
| **All tests**        | `npm test`                   |
| **Sanity only**      | `npm run test:sanity`        |
| **Full regression**  | `npm run test:full-regression` |

- **Sanity** = a small set of critical-path tests (fast run). Use this when you want quick feedback locally; it is not run in CI.
- **Full regression** = the full suite (all tests). This is what runs in CI.

## Viewing reports

After running tests locally:

- **Playwright HTML report**  
  - Open the last report: `npm run report:playwright`  
  - Or open the folder: `playwright-report/` (e.g. open `index.html` in a browser).

- **Allure report**  
  - Generate and open: `npm run report:allure`  
  - Requires **Java** (JRE 8+) to be installed so the Allure CLI can run.  
  - This generates from `allure-results/` into `allure-report/` and opens it in your browser.  
  - To only generate (no open):  
    `npx allure generate allure-results -o allure-report --clean`  
    then open `allure-report/index.html` in a browser.  
  - **Without Java:** you can still get the Allure report from CI by downloading the **allure-report** artifact and opening `index.html` from the zip.

## What runs in CI (GitHub Actions)

On every **push** or **pull request** to `main` or `master`, a single job runs:

- **Full regression**  
  - Command: `npx playwright test --project=full-regression`  
  - Uses Chromium only.  
  - Timeout: 60 minutes.

**Artifacts** (download from the run summary in the Actions tab):

- **playwright-report-full-regression** — Playwright HTML report (open `index.html` from the zip).
- **test-results-full-regression** — JUnit XML and raw test results.
- **allure-report** — Allure report (open `index.html` from the zip to view in a browser).

## Where things live

- **App under test:** `app/dummy-messaging-app.html`
- **Tests:** `tests/`
- **Page objects:** `pages/` (e.g. `chatPage.ts`)
- **Mocks:** `mocks/` (e.g. `messageSendMock.ts`)
- **Config:** `playwright.config.ts`
- **CI workflow:** `.github/workflows/playwright.yml`

Test suites are defined by tags (e.g. `@sanity`, `@full-regression`) and run via the projects `sanity` and `full-regression` in the config.

---

## Tools / AI used

This project was developed mainly using **Cursor** (AI-assisted editing and code generation). No other AI or code-generation tools were used.

---

## Decisions made & reasoning

- **Page Object Model (POM) + fixture**  
  Selectors and page actions live in `ChatPage`; the `baseTest` fixture creates the page object and navigates once per test. This keeps tests readable, avoids duplication, and centralizes UI changes in one place.

- **API mocking with `page.route()`**  
  The app has no backend. Playwright’s `page.route()` intercepts the send-message request and returns controlled responses (success, failure, status codes, delay, abort). That allows testing happy path, error handling, and edge cases (e.g. double-click) without a real server.

- **Tags and projects (sanity vs full-regression)**  
  Tests are tagged (e.g. `@sanity`, `@full-regression`). Two Playwright projects run by tag: sanity for fast local feedback, full-regression for CI and full runs. CI runs only full-regression so every run is complete and consistent.

- **Reporters**  
  - **HTML + JUnit:** Playwright’s built-in report for local debugging and CI artifacts; JUnit for tooling (e.g. Jenkins).  
  - **Allure:** Extra reporting with steps, history, and environment info.

---

## Future improvements / scaling

- **Browsers:** Add Firefox and WebKit projects for cross-browser coverage.
- **Visual regression:** Use Playwright screenshots or a tool like Percy/Applitools for UI consistency.
- **API tests:** Add direct API tests (e.g. with `request` context) for the send-message contract.
- **Config:** Use env-based config (e.g. base URL, timeouts) for different environments.
- **Parallelism:** Increase CI workers (when tests are stable) to shorten feedback time.
- **Flakiness:** Use Allure’s history and categories to track and triage flaky tests.
