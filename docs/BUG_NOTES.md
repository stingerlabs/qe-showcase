# Observations & Oddities

Honest log of things noticed while building the suites. **No user-facing
functional bugs were found** in either target — these are
behavioural/test-robustness observations, recorded because they shape how the
tests are written.

## SauceDemo

1. **Sort `<select>` is re-rendered on change (detached-DOM trap).**
   Changing the product sort causes React to re-render the page *including the
   select element itself*. A chained
   `cy.get(...).select('hilo').should('have.value', 'hilo')` fails with a
   detached-subject error. Not a user-facing bug, but a real trap for test
   authors: the suite splits the action and the assertion into separate
   queries, and asserts list order via retrying `.should(callback)`.
   (Reproduced 2026-06-10 during development; fixed in
   `purchase-flow.cy.js` / `sorting.cy.js`.)

2. **Tax rate is undocumented.** Checkout shows tax (8% of the item total in
   observed runs) but no business rule is published anywhere on the site. The
   suite asserts the arithmetic the user sees (`subtotal + tax == total`,
   `subtotal == item price`) and deliberately does not pin the rate.

## JSONPlaceholder

3. **Writes are simulated.** POST answers `201` with `id: 101`, PUT echoes the
   replacement, DELETE answers `200 {}` — but nothing persists (a follow-up GET
   still returns the original). Documented behaviour of the service, verified
   live; the collection asserts response contracts only.

4. **`GET /posts/999999` returns `404` with an empty object body `{}`** rather
   than an error payload (verified live 2026-06-10). The negative test pins
   this exact contract since consumers may branch on it.

## Tooling (not committed-code issues)

5. **Cypress 15 deprecation warning about `allowCypressEnv` — resolved.**
   The warning appeared on every run. The suite reads no `Cypress.env()` from
   browser code (verified by repo-wide search), so `allowCypressEnv: false` is
   now set in `cypress.config.js` — opting into the future-default lockdown.
   Verified: warning no longer appears and all specs still pass (2026-06-10).

6. **Node version constraint.** Cypress 15 supports Node `^20.1.0 || ^22.0.0
   || >=24.0.0` — odd-numbered Node 23 is unsupported and warns at install.
   `engines` in `package.json` plus `.nvmrc`/`.node-version` (22) now pin the
   guidance; CI runs Node 20. (npm prints an `EBADENGINE` *warning* on
   unsupported Nodes; installs still proceed since `engine-strict` is off.)

7. **`npm audit` posture (evidence captured 2026-06-10, not blind-fixed).**
   - `npm audit --omit=dev`: **0 vulnerabilities** — the repo has no
     production runtime dependencies at all (Cypress and Newman are
     devDependencies; nothing here ships to production).
   - `npm audit` (full): **17 vulnerabilities (7 moderate, 9 high, 1
     critical)** — every single one in **Newman's transitive tree**
     (`postman-runtime`, `postman-sandbox`, `postman-collection`,
     `postman-request` and their pins of `handlebars`, `lodash`, `node-forge`,
     `flatted`, `jose`, `qs`, `underscore`, `uuid`). None are reachable in
     production; they affect only local/CI test tooling that processes our own
     committed collection against public demo APIs.
   - **Why no forced upgrade:** `newman@6.2.2` is the latest published
     release, so the issues are upstream and unfixable from this repo. npm's
     only offered remediation (`npm audit fix --force`) "resolves" the tree by
     downgrading to `newman@2.1.2` (2016-era, breaking) — strictly worse.
     Accepted as dev-tooling risk; revisit when Postman ships updated runtime
     packages.
