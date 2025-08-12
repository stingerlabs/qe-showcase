const { defineConfig } = require("cypress");
const { getUrl } = require("./cypress/config/env.config");

const testEnvironment = process.env.testEnvironment || "prod";
const baseUrl = getUrl(testEnvironment);

module.exports = defineConfig({
  projectId: "isnrvj",
  e2e: {
    baseUrl,
    setupNodeEvents(on, config) {
      console.log(`Running tests in ${testEnvironment}`);
      return config;
    },
    experimentalStudio: true,
  },
});
