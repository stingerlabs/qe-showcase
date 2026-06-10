// Checkout step one: customer information form.
class CheckoutInfoPage {
  assertLoaded() {
    cy.url().should("include", "/checkout-step-one.html");
  }

  typeFirstName(value) {
    cy.getByDataTest("firstName").type(value);
  }

  typeLastName(value) {
    cy.getByDataTest("lastName").type(value);
  }

  typePostalCode(value) {
    cy.getByDataTest("postalCode").type(value);
  }

  fillCustomer({ firstName, lastName, postalCode }) {
    this.typeFirstName(firstName);
    this.typeLastName(lastName);
    this.typePostalCode(postalCode);
  }

  /** Submit the form via Continue. Validation errors keep the user here. */
  submit() {
    cy.getByDataTest("continue").click();
  }

  errorMessage() {
    return cy.getByDataTest("error");
  }
}

module.exports = new CheckoutInfoPage();
