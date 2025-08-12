/**
 * Page object for the Checkout information Page
 *
 * @class CheckoutInfoPage
 * @description Methods for interacting with the Checkout Info Page
 */
export class CheckoutInfoPage {
  // Locators
  // Using different ways to show usage of css selectors
  buttonContinue = '[data-test="continue"]';
  inputFirstName = '[data-test="firstName"]';
  inputLastName = '[data-test="lastName"]';
  inputZipcode = '[data-test="postalCode"]';

  clickContinueButton() {
    cy.get(this.buttonContinue).click();
  }

  fillCustomerInformation(firstName, lastName, zipCode) {
    cy.get(this.inputFirstName).type(firstName);
    cy.get(this.inputLastName).type(lastName);
    cy.get(this.inputZipcode).type(zipCode);
  }
}
