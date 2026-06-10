// Order confirmation page.
class CheckoutCompletePage {
  assertLoaded() {
    cy.url().should("include", "/checkout-complete.html");
  }

  successHeader() {
    return cy.getByDataTest("complete-header");
  }

  successMessage() {
    return cy.getByDataTest("complete-text");
  }

  backToProducts() {
    cy.getByDataTest("back-to-products").click();
  }
}

module.exports = new CheckoutCompletePage();
