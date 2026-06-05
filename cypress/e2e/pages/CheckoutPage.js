/**
 * Checkout step one — customer information form (/checkout-step-one.html).
 *
 * Split from OverviewPage on purpose (SRP): step one is data entry,
 * step two is financial summary. Keeps each class focused and easier to maintain.
 */
class CheckoutPage {
  selectors = {
    firstName: '[data-test="firstName"]',
    lastName: '[data-test="lastName"]',
    postalCode: '[data-test="postalCode"]',
    continue: '[data-test="continue"]',
    cancel: '[data-test="cancel"]',
    checkoutInfoContainer: '[data-test="checkout-info-container"]',
    title: '[data-test="title"]',
  };

  assertOnPage() {
    cy.get(this.selectors.title).should("contain.text", "Checkout: Your Information");
    cy.get(this.selectors.checkoutInfoContainer).should("be.visible");
    return this;
  }

  fillFirstName(firstName) {
    cy.get(this.selectors.firstName).clear().type(firstName);
    return this;
  }

  fillLastName(lastName) {
    cy.get(this.selectors.lastName).clear().type(lastName);
    return this;
  }

  fillPostalCode(postalCode) {
    cy.get(this.selectors.postalCode).clear().type(postalCode);
    return this;
  }

  fillCheckoutForm(firstName, lastName, postalCode) {
    this.fillFirstName(firstName);
    this.fillLastName(lastName);
    this.fillPostalCode(postalCode);
    return this;
  }

  continueToOverview() {
    cy.get(this.selectors.continue).click();
    return this;
  }

  cancelCheckout() {
    cy.get(this.selectors.cancel).click();
    return this;
  }
}

export default new CheckoutPage();
