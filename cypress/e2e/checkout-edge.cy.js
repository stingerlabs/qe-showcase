/**
 * Checkout Edge Case Tests
 * Dedicated test suite for checkout form edge cases
 *
 * WORLD CLASS APPROACH: Focused testing of edge cases with clean setup
 * Demonstrates data-driven testing and reusable flows
 * Uses fixtures to avoid hardcoded values
 */

describe('Checkout Edge Case Tests', () => {
  let productsData;

  beforeEach(() => {
    cy.visit('/');
    cy.fixture('users.json').as('users');
    cy.fixture('checkout-data.json').as('checkoutData');
    cy.fixture('products.json').then((data) => {
      productsData = data;
    });
    cy.get('@users').then(({ standard_user }) => {
      cy.login(standard_user.username, standard_user.password);
    });
  });

  const edgeCases = [
    { label: 'long names', key: 'long_names' },
    { label: 'special characters', key: 'special_chars' },
  ];

  edgeCases.forEach(({ label, key }) => {
    it(`should handle ${label} in checkout form`, () => {
      cy.get('@checkoutData').then((data) => {
        cy.checkoutFlow(productsData.products.backpack, data[key], { finish: false });
        // Use business assertion instead of hardcoded URL
        cy.get('[data-test="subtotal-label"]').should('be.visible');
      });
    });
  });
});
