# PR title

```
Complete QE showcase: Cypress purchase-flow coverage + Newman /posts collection
```

# PR body (ready to paste — follows .github/PULL_REQUEST_TEMPLATE.md)

## What did you build?

Both exercise paths, since this submission completes the repo end-to-end —
**Cypress as the primary path**, the **Postman/Newman collection as completed
full-scope/bonus coverage**:

**UI (Cypress, SauceDemo)** — 8 tests across 5 specs:

- `purchase-flow.cy.js` — one deep happy-path journey: login → verify the
  6-item catalog rendered → sort by price high→low (**order actually verified**
  from the displayed prices, parsed to integer cents) → capture the top
  product's name/price → add to cart (button state + badge checked) → cart
  contains exactly that product (name, qty 1, price) → checkout with fixture
  data → overview shows the same item/price + payment & shipping blocks →
  **money math asserted in cents** (`subtotal == item price`,
  `total == subtotal + tax`) → finish → "Thank you for your order!" → back to
  products with the cart badge gone.
- `login.cy.js` — locked-out user: exact lockout message, stays on the login
  page, inventory unreachable.
- `checkout-validation.cy.js` — required-field errors asserted individually
  and in order (first name → last name → postal code).
- `cart.cy.js` — removal: line items *and* badge must both clear.
- `sorting.cy.js` — all four sort options, each verified against the rendered
  result (data-driven).

Structured as a page object model: classes under `cypress/pages/` (one per
page, plus a shared header component) own every selector, action, and
load-state guard, so specs contain no raw selectors — only orchestration and
business assertions. A markup change is a one-file fix.

**API (Postman collection v2.1 + environment, run via Newman)** — 7 requests,
20 assertions against JSONPlaceholder `/posts`: GET list (100 seeded posts,
unique ids 1..100, full schema, authors within the 10 seeded users), GET
single (id round-trip), POST (fake create: 201, echoes a **per-run generated
payload**, fresh id beyond the seeded range), PUT (full replace: stable id,
echoed document), DELETE (200 + `{}`), deterministic 404 for an unknown id,
and `?userId=1` filtering (exactly the author's 10 posts).

**Tradeoffs made:**

- One deep E2E journey with strong assertions instead of many shallow specs —
  the deep journey is what protects revenue.
- JSONPlaceholder **fakes writes**, so API write tests assert the response
  contract only and never assume persistence (documented in the collection
  and `newman/README.md`).
- Exact-count assertions (6 products, 100 posts) are deterministic against
  these fixed demo datasets and double as "rendered completely" checks; against
  a live product they'd be range/seeded-fixture assertions.
- Plus: reproducible tooling (`npm ci` + committed lockfile, deps moved to
  `devDependencies`), `test:ui` / `test:api` / `test:all` scripts, and a small
  CI workflow running both suites (bonus signal, not load-bearing).

## How you worked

- Explored both targets manually first (selectors, error copy, totals
  behaviour, API response contracts) and pinned assertions to what the live
  services actually return — e.g. JSONPlaceholder's `201`/`id: 101` create,
  `{}` bodies on delete/404, verified by inspection before being asserted.
- Wrote the UI layer page-object-first against SauceDemo's stable `data-test`
  attributes (page objects build on a `cy.getByDataTest` command) — no
  CSS-class or DOM-position selectors, no `cy.wait(ms)` anywhere.
- Money handled in integer cents (`parseUsdToCents` helper, throws loudly on
  unparseable input) to keep totals math exact and false-pass resistant.
- Ran suites repeatedly while iterating; caught and fixed a real detached-DOM
  trap (SauceDemo re-renders the sort `<select>` on change) by splitting
  action/assertion and using retrying `.should(callback)` for order checks —
  see `docs/BUG_NOTES.md`.
- Used an AI coding assistant the way I would on the job: drafting and
  cross-checking against live behaviour; everything committed was executed and
  verified locally (`npm ci` from scratch, then both suites green).
- Full reasoning: `docs/TEST_STRATEGY.md`; observations: `docs/BUG_NOTES.md`.

## What you chose not to test

- **SauceDemo's intentionally-broken personas** (`problem_user`,
  `performance_glitch_user`, …): they simulate product bugs by design;
  asserting their behaviour adds noise, not signal. `locked_out_user` is
  covered because it's a real access-control path.
- **API malformed-payload/auth/rate-limit cases**: JSONPlaceholder accepts
  nearly anything and has no auth — such tests would document quirks of a fake
  service rather than protect a contract. The deterministic 404 is the negative
  path that is stable, so it's the one covered.
- Also consciously skipped (reasoning in `docs/TEST_STRATEGY.md`):
  wrong-password login (same pattern as lockout, marginal signal),
  multi-item carts (no quantity controls in the app), visual/a11y/cross-browser
  (wrong tier for this exercise), load tests (rude to a free public service).

## What would you improve with more time?

1. Hermetic targets we own (containerised app + API) so public-service outages
   can't fail the suite — the biggest real risk here.
2. API-seeded UI state (`cy.session` + request-based setup) to make non-login
   specs faster and independent of the login UI.
3. Schema-based contract validation (OpenAPI/JSON Schema) replacing hand-rolled
   shape checks in the collection.
4. CI hardening: JUnit/HTML reporting, flake-rate tracking with a quarantine
   lane, and burn-in runs for new specs.

## Which task did you choose?

- [x] Cypress *(primary)*
- [x] Postman *(completed as full-scope/bonus coverage — this submission
  intentionally completes both paths end-to-end)*

---

### Test evidence (local, 2026-06-10, fresh `npm ci`)

| Command | Result |
|---------|--------|
| `npm ci` | clean install from committed lockfile |
| `npm run test:api` | 7 requests, 20 assertions, **0 failures** (~3s) |
| `npm run test:ui` | 5 specs, 8 tests, **8 passing** (~30s) |
| `npm run test:all` | API + UI suites, **all green** |

> Note: suites run against live public demo services (saucedemo.com,
> jsonplaceholder.typicode.com). If either is down, tests/CI fail without a
> repo defect — accepted and documented in `docs/TEST_STRATEGY.md`.

Thank you for sharing your work and process with us!
