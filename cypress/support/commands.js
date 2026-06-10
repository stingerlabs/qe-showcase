// Custom commands for the SauceDemo suite.
//
// SauceDemo ships stable `data-test` attributes on almost every element, so
// all selectors go through `getByDataTest` instead of CSS classes or DOM
// position. If the app's markup changes, tests fail on a missing data-test
// hook (clear signal) rather than silently matching the wrong element.

/**
 * Select an element by its `data-test` attribute.
 * Usage: cy.getByDataTest('login-button')
 */
Cypress.Commands.add("getByDataTest", (value) => cy.get(`[data-test="${value}"]`));

/**
 * Log in through the real login form (no cookie/localStorage shortcuts —
 * login is part of the behaviour under test for this exercise).
 * Asserts the form is actually present before typing so failures point at
 * the right step.
 */
Cypress.Commands.add("loginAs", ({ username, password }) => {
  cy.visit("/");
  cy.getByDataTest("login-button").should("be.visible");
  cy.getByDataTest("username").type(username);
  cy.getByDataTest("password").type(password, { log: false });
  cy.getByDataTest("login-button").click();
});

/**
 * Add the first listed inventory item to the cart.
 * Used by specs (cart, checkout validation) that need "an item in the cart"
 * as setup but don't care which item it is.
 */
Cypress.Commands.add("addFirstInventoryItemToCart", () => {
  cy.getByDataTest("inventory-item")
    .first()
    .find('button[data-test^="add-to-cart"]')
    .click();
  cy.getByDataTest("shopping-cart-badge").should("have.text", "1");
});
