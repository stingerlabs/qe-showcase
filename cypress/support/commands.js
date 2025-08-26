// Import page objects and utilities
const LoginPage = require('./pages/LoginPage.js');
const InventoryPage = require('./pages/InventoryPage.js');
const CartPage = require('./pages/CartPage.js');
const CheckoutPage = require('./pages/CheckoutPage.js');
const BusinessAssertions = require('./utils/businessAssertions.js');

// Core commands - minimal, focused
Cypress.Commands.add('login', (username, password) => {
  LoginPage.signIn(username, password);
  BusinessAssertions.assertOnProductsPage();
});

Cypress.Commands.add('addToCart', (productName) => InventoryPage.addToCart(productName));
Cypress.Commands.add('removeFromCart', (productName) => InventoryPage.removeFromCart(productName));
Cypress.Commands.add('sortProducts', (criteria) => InventoryPage.sortBy(criteria));
Cypress.Commands.add('goToCart', () => {
  InventoryPage.goToCart();
  BusinessAssertions.assertOnCartPage();
});

Cypress.Commands.add('proceedToCheckout', () => {
  CartPage.proceedToCheckout();
  BusinessAssertions.assertOnCheckoutInfoPage();
});

Cypress.Commands.add('fillCheckoutInfo', (addressData) => CheckoutPage.fillAddress(addressData));
Cypress.Commands.add('completePurchase', () => {
  CheckoutPage.continue();
  BusinessAssertions.assertOnCheckoutReviewPage();
  CheckoutPage.finish();
  BusinessAssertions.assertOrderCompleted();
});

// Reusable flows
Cypress.Commands.add('completePurchaseFlow', (productName, addressData) => {
  cy.addToCart(productName);
  cy.goToCart();
  cy.proceedToCheckout();
  cy.fillCheckoutInfo(addressData);
  cy.completePurchase();
});

Cypress.Commands.add('checkoutFlow', (product, address, { finish = true } = {}) => {
  cy.addToCart(product);
  cy.goToCart();
  cy.proceedToCheckout();
  cy.fillCheckoutInfo(address);
  cy.get('[data-test="continue"]').click();
  if (finish) {
    cy.get('[data-test="finish"]').click();
    BusinessAssertions.assertOrderCompleted();
  }
});

// Verification helpers
Cypress.Commands.add('verifyCartBadgeCount', (expectedCount) => InventoryPage.verifyCartBadgeCount(expectedCount));
Cypress.Commands.add('verifyProductsSorted', (criteria, direction = 'ascending') => {
  criteria.includes('Price') ? InventoryPage.verifyProductsSortedByPrice(direction) : InventoryPage.verifyProductsSortedByName(direction);
});