const header = require("./components/header.component");
const { parseUsdToCents } = require("../support/helpers");

class InventoryPage {
  assertLoaded() {
    cy.url().should("include", "/inventory.html");
    this.productList().should("be.visible");
  }

  productList() {
    return cy.getByDataTest("inventory-list");
  }

  items() {
    return cy.getByDataTest("inventory-item");
  }

  itemNames() {
    return cy.getByDataTest("inventory-item-name");
  }

  itemPrices() {
    return cy.getByDataTest("inventory-item-price");
  }

  /**
   * Select a sort option and confirm the control reflects it.
   * Select and assert are separate queries on purpose — the app re-renders
   * the <select> on change, which would detach a chained subject.
   */
  sortBy(option) {
    cy.getByDataTest("product-sort-container").select(option);
    cy.getByDataTest("product-sort-container").should("have.value", option);
  }

  /**
   * Capture the first listed item's name and price (as integer cents) into
   * the caller's object, so later pages can be asserted against what was
   * really selected rather than hardcoded values.
   */
  captureFirstItemDetails(into) {
    this.items()
      .first()
      .within(() => {
        cy.getByDataTest("inventory-item-name")
          .invoke("text")
          .then((name) => (into.name = name.trim()));
        cy.getByDataTest("inventory-item-price")
          .invoke("text")
          .then((price) => (into.cents = parseUsdToCents(price)));
      });
  }

  /**
   * Add the first listed item to the cart and verify the action registered:
   * the button swaps to "Remove" (app state changed, not just a click event)
   * and the header badge shows 1. These guards keep callers from racing ahead
   * of the UI.
   */
  addFirstItemToCart() {
    this.items()
      .first()
      .within(() => {
        cy.get('button[data-test^="add-to-cart"]').click();
        cy.get('button[data-test^="remove"]').should("be.visible");
      });
    header.cartBadge().should("have.text", "1");
  }
}

module.exports = new InventoryPage();
