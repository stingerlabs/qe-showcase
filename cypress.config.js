const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        specPattern: "cypress/e2e/**/*.spec.{js,jsx,ts,tsx}",

        baseUrl: "https://www.saucedemo.com",

        supportFile: "cypress/support/e2e.js",

        setupNodeEvents(on, config) {
            // implement node event listeners here if needed
        }
    }
});
