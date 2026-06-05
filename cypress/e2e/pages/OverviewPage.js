/**
 * Checkout step two — order summary before placing the order.
 *
 * Financial assertions live here because pricing errors at checkout are
 * high-impact (wrong charge, tax miscalculation). We derive expected totals
 * from live DOM values instead of hard-coding amounts so tests stay valid
 * if catalog prices change.
 */
class OverviewPage {
  selectors = {
    summaryContainer: '[data-test="checkout-summary-container"]',
    itemName: '[data-test="inventory-item-name"]',
    itemPrice: '[data-test="inventory-item-price"]',
    paymentInfoLabel: '[data-test="payment-info-label"]',
    shippingInfoLabel: '[data-test="shipping-info-label"]',
    subtotalLabel: '[data-test="subtotal-label"]',
    taxLabel: '[data-test="tax-label"]',
    totalLabel: '[data-test="total-label"]',
    finish: '[data-test="finish"]',
    cancel: '[data-test="cancel"]',
    title: '[data-test="title"]',
  };

  /**
   * Parses currency text from Sauce Demo labels (e.g. "$49.99", "Tax: $4.00").
   * Kept as a pure function so the math is unit-testable and separate from Cypress IO.
   */
  parseMoney(text) {
    const match = String(text).match(/\$([\d.]+)/);
    if (!match) {
      throw new Error(`Could not parse currency from: "${text}"`);
    }
    return parseFloat(match[1]);
  }

  assertOnPage() {
    cy.get(this.selectors.title).should("contain.text", "Checkout: Overview");
    cy.get(this.selectors.summaryContainer).should("be.visible");
    return this;
  }

  assertSummaryItem(productName) {
    cy.get(this.selectors.itemName).should("contain.text", productName);
    return this;
  }

  assertPaymentAndShippingVisible() {
    cy.get(this.selectors.paymentInfoLabel).should("be.visible");
    cy.get(this.selectors.shippingInfoLabel).should("be.visible");
    return this;
  }

  assertTotalsVisible() {
    cy.get(this.selectors.subtotalLabel).should("be.visible");
    cy.get(this.selectors.taxLabel).should("be.visible");
    cy.get(this.selectors.totalLabel).should("be.visible");
    return this;
  }

  /**
   * Reads line-item prices and tax from the page, computes subtotal + tax,
   * and asserts the UI "Total" matches. Catches regressions where displayed
   * totals diverge from line items (financial / compliance risk).
   *
   * DOM format (verified on saucedemo.com): "Tax: $4.00", "Total: $53.99".
   */
  assertDisplayedTotalMatchesCalculation() {
    cy.get(this.selectors.itemPrice).then(($itemPrices) => {
      cy.get(this.selectors.taxLabel).then(($tax) => {
        cy.get(this.selectors.totalLabel).then(($total) => {
          const lineItemTotal = [...$itemPrices].reduce(
            (sum, el) => sum + this.parseMoney(el.innerText),
            0,
          );

          const tax = this.parseMoney($tax.text());
          const expectedTotal = lineItemTotal + tax;
          const displayedTotal = this.parseMoney($total.text());

          // closeTo avoids false failures from binary floating-point representation
          expect(displayedTotal, "checkout total").to.be.closeTo(expectedTotal, 0.01);
        });
      });
    });
    return this;
  }

  finishOrder() {
    cy.get(this.selectors.finish).click();
    return this;
  }
}

// Singleton: one shared instance keeps imports simple in specs (no `new` in every test)
export default new OverviewPage();
