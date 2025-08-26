/**
 * CartPage - Minimal Page Object Model
 * Cart verification and checkout navigation
 * 
 * WORLD CLASS APPROACH: Using slugify for consistent selector generation
 */

const slugify = require('../utils/slugify.js');

class CartPage {
  // Selectors
  get cartItems() { return '[data-test="inventory-item"]'; }
  get itemNames() { return '[data-test="inventory-item-name"]'; }
  get itemPrices() { return '[data-test="inventory-item-price"]'; }
  get checkoutButton() { return '[data-test="checkout"]'; }
  get continueShoppingButton() { return '[data-test="continue-shopping"]'; }
  get cartContainer() { return '[data-test="cart-contents-container"]'; }

  // Actions
  proceedToCheckout() {
    cy.get(this.checkoutButton).should('be.visible').click();
  }

  continueShopping() {
    cy.get(this.continueShoppingButton).should('be.visible').click();
  }

  // Assertions
  assertHasItem(expectedItemName) {
    cy.get(this.itemNames).should('contain', expectedItemName);
  }

  assertItemPrice(expectedItemName, expectedPrice) {
    cy.get(this.itemNames)
      .contains(expectedItemName)
      .parent()
      .find('[data-test="inventory-item-price"]')
      .should('contain', expectedPrice);
  }

  assertCartItemCount(expectedCount) {
    cy.get(this.cartItems).should('have.length', expectedCount);
  }

  assertCartIsVisible() {
    cy.get(this.cartContainer).should('be.visible');
  }

  // Helper method using slugify for future extensibility
  getProductSelector(productName, action = '') {
    const baseSelector = slugify(productName);
    return action ? `[data-test="${action}-${baseSelector}"]` : `[data-test="${baseSelector}"]`;
  }
}

module.exports = new CartPage();