/**
 * Checkout complete — post-order success state.
 *
 * Success copy is asserted via data-test elements, not page text scraping,
 * so wording tweaks in non-test nodes do not break tests.
 */
class ConfirmationPage {
  selectors = {
    completeContainer: '[data-test="checkout-complete-container"]',
    completeHeader: '[data-test="complete-header"]',
    completeText: '[data-test="complete-text"]',
    backToProducts: '[data-test="back-to-products"]',
    title: '[data-test="title"]',
  };

  // Copy verified via live saucedemo.com DOM (data-test="complete-text")
  expectedMessages = {
    header: "Thank you for your order!",
    body: "Your order has been dispatched, and will arrive just as fast as the pony can get there!",
  };

  assertOnPage() {
    cy.url().should("include", "checkout-complete");
    cy.get(this.selectors.completeContainer).should("be.visible");
    return this;
  }

  assertSuccessHeader() {
    cy.get(this.selectors.completeHeader)
      .should("be.visible")
      .and("have.text", this.expectedMessages.header);
    return this;
  }

  assertOrderComplete() {
    this.assertSuccessHeader();
    cy.get(this.selectors.completeText)
      .should("be.visible")
      .and("contain.text", this.expectedMessages.body);
    return this;
  }

  returnToInventory() {
    cy.get(this.selectors.backToProducts).click();
    return this;
  }
}

export default new ConfirmationPage();
