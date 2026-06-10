# Test Strategy

Scope, reasoning, and honest limitations for the QE showcase submission.
Companion docs: [README — Implemented solution](../README.md#implemented-solution),
[newman/README.md](../newman/README.md) (API suite details),
[PR_DESCRIPTION.md](PR_DESCRIPTION.md).

## Scope

| Area | Target | Tooling |
|------|--------|---------|
| UI/E2E (primary path) | SauceDemo purchase flow | Cypress |
| API (full-scope/bonus path) | JSONPlaceholder `/posts` | Postman collection via Newman |

Both exercise paths are implemented because this submission completes the repo
end-to-end; the original exercise asks for one.

## Why these tests

Risk-ranked, highest first:

1. **Purchase flow (Cypress, one deep journey).** Login → sort → add to cart →
   cart verification → checkout → order math → confirmation. This is the
   revenue path; a regression anywhere on it is the worst plausible failure.
   One *deep* journey with strong assertions beats five shallow ones — every
   step is verified against data captured at selection time (product name,
   price), so cart, overview, and totals must all agree with what was actually
   chosen, not with hardcoded expectations.
2. **Order math (inside the journey).** `subtotal == selected item price` and
   `total == subtotal + tax`, computed in integer cents. Money math bugs are
   high-impact and embarrassingly easy to false-pass with "totals are visible"
   assertions.
3. **Checkout required-field validation (Cypress).** The gate in front of the
   money step. Asserts the *specific* error per missing field, in the order the
   app reports them (first name → last name → postal code).
4. **Locked-out login (Cypress).** Access-control failure mode with an exact
   message assertion; also asserts the user stays on the login page and the
   inventory is unreachable.
5. **Sorting correctness (Cypress).** All four options verified against the
   rendered result — prices/names extracted and order asserted numerically or
   lexicographically. Selecting a dropdown without checking the outcome tests
   nothing.
6. **Cart removal (Cypress).** Badge and line items must agree after removal;
   checking only one can hide a stale-state bug.
7. **API contract for `/posts` (Newman).** Reads (list/single/filter) assert
   the full seeded contract (size, schema, unique ids, author range). Writes
   (POST/PUT/DELETE) assert the response contract only, because JSONPlaceholder
   fakes persistence. A deterministic 404 case covers the unknown-id path.

## False-pass risks and how the implementation reduces them

A test that can't fail when the product breaks is worse than no test.

| False-pass risk | Mitigation in this suite |
|-----------------|--------------------------|
| "Sorted" asserted by selecting the dropdown only | Displayed prices/names are extracted and their actual order asserted |
| Cart/overview checked for "an item exists" | Name and price compared against values captured when the product was selected |
| Total checked for visibility only | `subtotal + tax == total` asserted in integer cents; float arithmetic avoided entirely |
| "Some error appeared" on login/checkout | Exact business-relevant message text asserted per case |
| API "create works" passing against stale data | POST payload is generated per run (timestamped), so echo assertions can't match anything stale |
| API tests asserting against *any* JSON array | List test pins the seeded contract: 100 posts, unique ids spanning 1..100, authors within the 10 seeded users |
| Silent NaN comparisons if the price markup changes | `parseUsdToCents` throws loudly on unparseable input |

## Flake risks and mitigations

| Risk | Mitigation |
|------|------------|
| Public demo sites are slow/down/rate-limited | Tolerant timeouts (10s command / 30s page load); 1 retry in `runMode` only — enough to absorb a network blip, not enough to mask a real regression. Open mode has 0 retries so flake is visible during development |
| React re-renders detaching elements | Action and assertion split into separate queries; order assertions use retrying `.should(callback)` instead of `.then` (a detached-`<select>` failure was hit and fixed during development — see BUG_NOTES) |
| Selector brittleness | Every selector goes through `data-test` attributes (via `cy.getByDataTest`); zero CSS-class or DOM-position selectors |
| Test-order coupling | Cypress `testIsolation` stays on; every spec logs in fresh through the UI; no test consumes state from another. Newman requests are each self-contained (the one cross-request variable, `createdPostId`, is reporting-only) |
| Hard waits papering over timing | No `cy.wait(ms)` anywhere; only retrying queries and assertions |

## Deterministic-by-design choices

- Exact inventory count (6) and exact API dataset sizes (100 posts, 10 per
  author) are asserted because both targets are **fixed demo datasets** — these
  assertions are deterministic here and double as "page/payload rendered
  completely" checks. Against a live product these would be range or
  seeded-fixture assertions instead.
- The tax *rate* is deliberately **not** asserted (it's not a documented
  business rule of SauceDemo); only the arithmetic consistency of what the user
  sees is.
- JSONPlaceholder **fakes writes** (POST/PUT/DELETE persist nothing), so write
  tests assert the response contract and never re-read expecting persistence.

## What was intentionally not tested, and why

- **Other SauceDemo personas** (`problem_user`, `performance_glitch_user`,
  `error_user`, `visual_user`): they exist to *simulate* product bugs; testing
  them asserts intentionally broken behaviour and adds noise, not signal, to a
  purchase-flow suite. `locked_out_user` is the exception because it exercises
  a real access-control path.
- **Wrong-password login**: same assertion pattern as the locked-out case with
  a different message; marginal added signal for this exercise's scope.
- **Multi-item carts / quantity changes**: SauceDemo carts are qty-1 per
  product with no quantity controls; multi-item totals add little beyond the
  single-item math already covered.
- **Visual/layout regression, accessibility, cross-browser**: real concerns,
  wrong tier — they need dedicated tooling (Percy/axe/browser matrix) and CI
  budget, and would dominate this exercise's review surface.
- **API auth, rate-limit, and malformed-payload behaviour**: JSONPlaceholder
  has no auth and accepts nearly anything (e.g. POST with an empty body still
  returns 201) — asserting that behaviour would document quirks of a fake
  service, not protect a contract. The deterministic 404 is the negative case
  that *is* stable, so it's the one covered.
- **Load/performance**: out of scope and rude to a free public service.

## What I'd add before trusting this in a production pipeline

1. **Hermetic environments**: an app instance and API we own (containerised or
   ephemeral env per PR) instead of public demo services — removes the
   third-party availability risk from the signal entirely.
2. **API-seeded UI state**: log in / seed carts via API for the non-login UI
   specs (e.g. `cy.session` + request-based setup) to cut runtime and isolate
   the UI assertions from login UI churn.
3. **Contract tests against a schema** (OpenAPI/JSON Schema validation in the
   API suite) instead of hand-rolled shape checks.
4. **Reporting**: JUnit/HTML reporters wired into CI with trend dashboards;
   screenshots/videos retained per failure (JSON report upload is already in
   the workflow).
5. **Quarantine + flake tracking**: tag-based quarantine lane and a flake-rate
   budget before a test can gate merges.
6. **Burn-in for new tests**: run new/changed specs N times in CI before they
   count, to catch nondeterminism before it costs the team trust.

## Manual validation performed

- Both suites executed locally from a fresh `npm ci` (results in the PR
  description): Newman 7 requests / 20 assertions green; Cypress 8 tests
  across 5 specs green.
- JSONPlaceholder response contracts (status codes, `id: 101` on create, `{}`
  bodies on delete/404) verified by inspecting live responses during
  collection development, not assumed from docs.
- SauceDemo `data-test` attributes, error copy, and totals behaviour verified
  against the live app while writing selectors and assertions.
- One real defect-shaped issue found and handled during development (detached
  `<select>` after sort re-render) — documented in
  [BUG_NOTES.md](BUG_NOTES.md).

## Known limitations

- **External dependency**: both targets are public services; an outage fails
  the suites (and CI) with no product defect present. Accepted and documented
  for this exercise; see production list above for the real fix.
- **Demo-calibrated assertions**: exact-count and exact-copy assertions are
  correct *here* because the datasets and strings are fixed; they would be
  recalibrated against a product with real data churn.
- **No persistence verification on the API write path** — impossible against a
  fake-write service; the suite says so explicitly rather than pretending.
- **CI runs are environment-sensitive**: shared runners + public targets mean
  occasional latency-driven retries; `runMode: 1` retry absorbs blips and the
  retry count is kept low precisely so genuine flake stays visible.
