// Custom commands for the SauceDemo suite.
//
// SauceDemo ships stable `data-test` attributes on almost every element, so
// all selectors go through `getByDataTest` instead of CSS classes or DOM
// position. If the app's markup changes, tests fail on a missing data-test
// hook (clear signal) rather than silently matching the wrong element.
//
// Page-level actions and selectors live in the page objects under
// cypress/pages/ — this file only holds the selector strategy they build on.

/**
 * Select an element by its `data-test` attribute.
 * Usage: cy.getByDataTest('login-button')
 */
Cypress.Commands.add("getByDataTest", (value) => cy.get(`[data-test="${value}"]`));
