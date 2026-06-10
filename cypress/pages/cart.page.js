class CartPage {
  assertLoaded() {
    cy.url().should("include", "/cart.html");
  }

  /** Cart line items (the app reuses the inventory-item data-test in the cart). */
  items() {
    return cy.getByDataTest("inventory-item");
  }

  itemName() {
    return cy.getByDataTest("inventory-item-name");
  }

  itemPrice() {
    return cy.getByDataTest("inventory-item-price");
  }

  itemQuantity() {
    return cy.getByDataTest("item-quantity");
  }

  removeFirstItem() {
    cy.get('button[data-test^="remove"]').click();
  }

  checkout() {
    cy.getByDataTest("checkout").click();
  }
}

module.exports = new CartPage();
