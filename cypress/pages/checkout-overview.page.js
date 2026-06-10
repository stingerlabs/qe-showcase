const { parseUsdToCents } = require("../support/helpers");

// Checkout step two: order overview with payment/shipping info and totals.
class CheckoutOverviewPage {
  assertLoaded() {
    cy.url().should("include", "/checkout-step-two.html");
  }

  itemName() {
    return cy.getByDataTest("inventory-item-name");
  }

  itemPrice() {
    return cy.getByDataTest("inventory-item-price");
  }

  paymentInfo() {
    return cy.getByDataTest("payment-info-value");
  }

  shippingInfo() {
    return cy.getByDataTest("shipping-info-value");
  }

  // Totals are exposed as integer cents so specs assert exact money math
  // without re-parsing label text themselves.
  subtotalCents() {
    return cy.getByDataTest("subtotal-label").invoke("text").then(parseUsdToCents);
  }

  taxCents() {
    return cy.getByDataTest("tax-label").invoke("text").then(parseUsdToCents);
  }

  totalCents() {
    return cy.getByDataTest("total-label").invoke("text").then(parseUsdToCents);
  }

  finish() {
    cy.getByDataTest("finish").click();
  }
}

module.exports = new CheckoutOverviewPage();
