/**
 * Cart page — line-item verification and checkout entry.
 *
 * Reuses inventory data-test hooks (item name/price) because the cart
 * re-renders the same product row component as the catalog.
 */
class CartPage {
  selectors = {
    cartList: '[data-test="cart-list"]',
    itemName: '[data-test="inventory-item-name"]',
    itemDesc: '[data-test="inventory-item-desc"]',
    itemPrice: '[data-test="inventory-item-price"]',
    itemQuantity: '[data-test="item-quantity"]',
    checkout: '[data-test="checkout"]',
    continueShopping: '[data-test="continue-shopping"]',
    title: '[data-test="title"]',
  };

  assertOnPage() {
    cy.get(this.selectors.title).should("contain.text", "Your Cart");
    cy.get(this.selectors.cartList).should("be.visible");
    return this;
  }

  assertItemCount(count) {
    cy.get(this.selectors.itemName).should("have.length", count);
    return this;
  }

  assertItemInCart(productName) {
    cy.get(this.selectors.itemName).should("contain.text", productName);
    return this;
  }

  assertItemQuantity(quantity) {
    cy.get(this.selectors.itemQuantity).first().should("have.text", String(quantity));
    return this;
  }

  proceedToCheckout() {
    cy.get(this.selectors.checkout).click();
    return this;
  }
}

export default new CartPage();
