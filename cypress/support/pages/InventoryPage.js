/**
 * InventoryPage - World Class Tiny Page Object Model
 * Product sorting, cart actions, and sorting assertions
 * 
 * KEY DECISIONS:
 * - Tiny POM: Structure without over complicating the code
 * - Utility delegation: Complex logic in dedicated utilities
 * - slugify integration: Dynamic selector generation
 */

const SortVerifier = require('../utils/sortVerifier.js');
const slugify = require('../utils/slugify.js');

class InventoryPage {
  // ========================================
  // PRODUCT SORTING METHODS
  // ========================================
  
  // Uses data-test selectors for reliability
  sortBy(criteria) {
    cy.get('[data-test="product-sort-container"]').should('be.visible').select(criteria);
  }

  // ========================================
  // CART OPERATION METHODS
  // ========================================
  
  // slugify utility generates exact selectors from product names
  addToCart(productName) {
    const selector = `[data-test="add-to-cart-${slugify(productName)}"]`;
    cy.get(selector).should('be.visible').click();
  }

  removeFromCart(productName) {
    const selector = `[data-test="remove-${slugify(productName)}"]`;
    cy.get(selector).should('be.visible').click();
  }

  // Visibility check prevents flaky tests
  goToCart() {
    cy.get('[data-test="shopping-cart-link"]').should('be.visible').click();
  }

  // ========================================
  // ASSERTION METHODS
  // ========================================
  
  // Handles empty cart (no badge) vs. populated cart (badge with count)
  verifyCartBadgeCount(expectedCount) {
    cy.get('[data-test="shopping-cart-badge"]')
      .should(expectedCount === 0 ? 'not.exist' : 'contain', expectedCount);
  }

  // Delegates complex sorting logic to utility for maintainability
  verifyProductsSortedByPrice(direction = 'ascending') {
    SortVerifier.verifyPriceSort(direction);
  }

  verifyProductsSortedByName(direction = 'ascending') {
    SortVerifier.verifyNameSort(direction);
  }

  verifySortSelection(expectedOption) {
    SortVerifier.verifySortSelection(expectedOption);
  }

  // ========================================
  // UTILITY METHODS
  // ========================================
  
  // Flexible selector generation for future use
  getProductSelector(productName, action = '') {
    const baseSelector = slugify(productName);
    return action ? `[data-test="${action}-${baseSelector}"]` : `[data-test="${baseSelector}"]`;
  }
}

module.exports = new InventoryPage();