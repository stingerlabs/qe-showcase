const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // This suite never reads Cypress.env() from browser code (the baseUrl
  // override mentioned below uses config-level env, which is unaffected), so
  // opt in to the future-default lockdown now and silence the Cypress 15
  // deprecation warning.
  allowCypressEnv: false,

  e2e: {
    // System under test. Override without touching code via the standard
    // Cypress env mechanism, e.g. CYPRESS_BASE_URL=https://staging.example.com
    baseUrl: "https://www.saucedemo.com",

    // SauceDemo is a remote public demo site, so allow a little headroom over
    // the 4s default before declaring an element missing.
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,

    // One retry in CI/headless absorbs transient network blips against the
    // public demo site. Zero retries in open mode so flake is visible while
    // developing tests instead of being silently papered over.
    retries: { runMode: 1, openMode: 0 },

    // Screenshots on failure are cheap and useful evidence; video adds little
    // for a suite this small and slows runs down.
    screenshotOnRunFailure: true,
    video: false,

    setupNodeEvents(on, config) {
      // No plugins needed for this suite.
    },
  },
});
