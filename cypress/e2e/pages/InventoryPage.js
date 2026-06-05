/**
 * Inventory (product list) page — catalog sorting and add-to-cart actions.
 *
 * Product actions target [data-test="add-to-cart-<slug>"] so tests bind to
 * stable test IDs, not DOM order (which changes when sorting).
 */
class InventoryPage {
  selectors = {
    sortContainer: '[data-test="product-sort-container"]',
    cartLink: '[data-test="shopping-cart-link"]',
    cartBadge: '[data-test="shopping-cart-badge"]',
    inventoryItem: '[data-test="inventory-item"]',
    itemName: '[data-test="inventory-item-name"]',
    title: '[data-test="title"]',
  };

  // Values match native <select> option value attributes on saucedemo.com
  sortOptions = {
    nameAsc: "az",
    nameDesc: "za",
    priceLowHigh: "lohi",
    priceHighLow: "hilo",
  };

  assertOnPage() {
    cy.get(this.selectors.title).should("contain.text", "Products");
    cy.get(this.selectors.inventoryItem).should("have.length.at.least", 1);
    return this;
  }

  sortByPriceHighToLow() {
    cy.get(this.selectors.sortContainer).select(this.sortOptions.priceHighLow);
    return this;
  }

  sortBy(optionValue) {
    cy.get(this.selectors.sortContainer).select(optionValue);
    return this;
  }

  /**
   * @param {string} productSlug - e.g. "sauce-labs-fleece-jacket"
   */
  addProductToCart(productSlug) {
    cy.get(`[data-test="add-to-cart-${productSlug}"]`).click();
    return this;
  }

  /**
   * After sortByPriceHighToLow(), the first catalog row is the highest-priced item.
   * Uses the first [data-test^="add-to-cart"] within that row.
   */
  addTopListedProductToCart() {
    cy.get(this.selectors.inventoryItem)
      .first()
      .find('[data-test^="add-to-cart"]')
      .click();
    return this;
  }

  goToCart() {
    cy.get(this.selectors.cartLink).click();
    return this;
  }

  assertCartBadgeCount(count) {
    cy.get(this.selectors.cartBadge).should("have.text", String(count));
    return this;
  }
}

export default new InventoryPage();
