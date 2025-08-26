/**
 * Business Assertions - Essential Only
 * Focuses on business outcomes, minimal code
 * Uses fixtures to avoid hardcoded values
 */

class BusinessAssertions {
  static assertOnProductsPage() {
    cy.fixture('products.json').then((data) => {
      cy.get('[data-test="title"]').should('contain', data.page_titles.products);
    });
  }

  static assertOnCartPage() {
    cy.get('[data-test="cart-contents-container"]').should('be.visible');
  }

  static assertOnCheckoutInfoPage() {
    cy.get('[data-test="firstName"]').should('be.visible');
  }

  static assertOnCheckoutReviewPage() {
    cy.get('[data-test="subtotal-label"]').should('be.visible');
  }

  static assertOrderCompleted() {
    // Check for all completion elements using fixtures
    cy.fixture('products.json').then((data) => {
      cy.get('[data-test="complete-header"]').should('contain', data.messages.order_success_header);
      cy.get('[data-test="complete-text"]').should('contain', data.messages.order_success_text);
      cy.get('[data-test="back-to-products"]').should('be.visible');
      cy.get('[data-test="pony-express"]').should('be.visible');
    });
  }
}

module.exports = BusinessAssertions;
