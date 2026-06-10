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

5. **Cypress 15 deprecation warning** about `allowCypressEnv` appears on every
   run. Cosmetic at current version; no `Cypress.env()` usage in this suite
   depends on it. Worth revisiting when Cypress 16 lands.
