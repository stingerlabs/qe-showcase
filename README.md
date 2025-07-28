# QE Showcase

Welcome!

This repository is a take-home exercise for Quality Engineering (QE) candidates. The goal is **not** to grade you on correctness or to create a pass/fail test. Instead, we want to see how you approach real-world quality engineering problems, communicate your thought process, and use your favorite tools.

**Choose your own adventure:**  
Pick **one** of the following paths (see `/tasks/` for details):

- **Cypress**: Write an end-to-end test for a sample web app.
- **Postman**: Create an API test collection.

**What we care about:**

- How you structure your code and tests
- Realistic assertions and thoughtful test cases
- Clear communication (in code and comments)
- Basic Git usage (branch, commit)

**What we _don't_ care about:**

- Perfection or "the right answer"
- Full coverage or edge cases
- Build pipelines or automation

**How to proceed:**

1. Fork this repo.
2. Pick a task from `/tasks/` and follow the instructions.
3. Don't spend more than an hour on this.
4. Complete your solution and be ready to discuss your approach.

We'll leave comments and may ask questions — we're interested in your reasoning and how you respond, not just what you build.

**Have fun, and thank you for sharing your process with us!**

---

## Getting Started with Tooling

This repo includes the tools you'll need for any of the tasks:

- **Cypress** (UI/E2E)
- **Newman** (run Postman collections from the command line)

**Install dependencies:**

```bash
npm install
```

**Run Cypress:**

- Open interactive UI:  
  `npm run cypress:open`
- Run headless:  
  `npm run cypress:run`

**Run Newman:**

- `npm run newman`  
  (Edit the collection path as needed)

---
