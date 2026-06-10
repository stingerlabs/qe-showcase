# QE Showcase

Welcome!

This repository is a take-home exercise for Quality Engineering (QE) candidates. The goal is **not** to grade you on correctness or to create a pass/fail test. Instead, we want to see how you approach real-world quality engineering problems, communicate your thought process, and use your favorite tools.

Use the tools and workflow you would normally use on the job—including documentation, IDE assistants, or anything else you rely on in real work.

**Choose your own adventure:**  
Pick **one** of the following paths (see `/tasks/` for details):

- **Cypress**: Write an end-to-end test for a sample web app.
- **Postman**: Create an API test collection.

**What we care about:**

- How you structure your code and tests
- Realistic assertions and thoughtful test cases
- Clear communication (in code, comments, and your PR)
- Basic Git usage (branch, commit, PR)
- Risk-based thinking — what you chose to test and what you intentionally skipped

**What we _don't_ care about:**

- Perfection or "the right answer"
- Full coverage or exhaustive edge cases
- CI/CD pipelines (not required — if you add one because that's how you normally work, we'll treat it as a bonus signal, not a bar)

**How to proceed:**

1. Fork this repo.
2. Pick a task from `/tasks/` and follow the instructions.
3. Don't spend more than 30 minutes on this.
4. Open a PR with your solution. Use the PR template to tell us about your approach.
5. Be ready to walk through your submission and explain your choices — we may ask follow-up questions live or in PR comments.

We'll leave comments and may ask questions — we're interested in your reasoning and how you respond, not just what you build.

**Have fun, and thank you for sharing your process with us!**

---

## Getting Started with Tooling

This repo includes the tools you'll need for any of the tasks:

- **Cypress** (UI/E2E)
- **Newman** (run Postman collections from the command line)

**Install dependencies:**

```bash
npm ci
```

**Run Cypress:**

- Open interactive UI:  
  `npm run cypress:open`
- Run headless:  
  `npm run cypress:run`

**Run Newman:**

- `npm run test:api`  
  (Runs the committed collection under `newman/` — see below)

---

## Implemented solution

Both task paths are implemented, since this submission completes the repo
end-to-end. **Cypress is the primary path** (full SauceDemo purchase-flow
coverage); the **Postman/Newman collection is included as completed
full-scope/bonus coverage** of the JSONPlaceholder `/posts` API.

### Setup

```bash
npm ci
```

`package-lock.json` is committed, so installs are reproducible. No secrets or
`.env` files are needed — both targets are public demo services using public
demo credentials.

### Run

| Command | What it does |
|---------|--------------|
| `npm run test:ui` | Cypress suite, headless |
| `npm run test:api` | Newman run of the Postman collection |
| `npm run test:all` | API suite, then UI suite |
| `npm run cypress:open` | Cypress interactive runner |

### Layout

```
cypress/
  e2e/saucedemo/
    purchase-flow.cy.js        # happy path: login → sort → cart → checkout → order
    login.cy.js                # locked-out user negative path
    checkout-validation.cy.js  # required-field errors, in order
    cart.cy.js                 # remove item: badge + cart agree
    sorting.cy.js              # all 4 sort options, order actually verified
  fixtures/saucedemo/          # users + checkout customer data
  support/                     # getByDataTest/loginAs commands, money & sort helpers
newman/
  jsonplaceholder-posts.postman_collection.json   # 7 requests, 20 assertions
  jsonplaceholder.postman_environment.json        # baseUrl + existingPostId
  README.md                                       # API-suite details
.github/workflows/qe-showcase.yml                 # CI: both suites on push/PR
docs/
  TEST_STRATEGY.md             # scope, risks, tradeoffs, what was skipped & why
  PR_DESCRIPTION.md            # ready-to-paste PR body
```

### External dependencies — please read

The suites run against **live public demo services**:
[saucedemo.com](https://www.saucedemo.com) and
[jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com). If either
is down, slow, or rate-limiting, tests (and CI) can fail without anything in
this repo being broken. JSONPlaceholder also **fakes all writes** —
POST/PUT/DELETE return realistic responses but persist nothing, and the API
tests are written accordingly. Details and mitigations: see
[docs/TEST_STRATEGY.md](docs/TEST_STRATEGY.md).

---
