/**
 * Page object for the Order Confirmation Page
 *
 * @class OrderConfirmationPage
 * @description Methods for interacting with the Order Confirmation Page
 */
export class OrderConfirmationPage {
  // Locators
  // Using different ways to show usage of css selectors
  textNavHeading = '[data-test="title"]';
  textOrderConfirmationMessage = '[data-test="complete-text"]';
  textThankyouMessage = '[data-test="complete-header"]';

  // Static text should be stored outside of the test code
  checkoutHeading = "Checkout: Complete!";
  orderConfirmationMessage =
    "Your order has been dispatched, and will arrive just as fast as the pony can get there!";
  thankyouMessage = "Thank you for your order!";

  clickBackHomeButton() {
    cy.get(this.buttonBackHome).click();
  }

  assertOrderConfirmationMessages() {
    cy.get(this.textNavHeading)
      .should("be.visible")
      .and("have.text", this.checkoutHeading);
    cy.get(this.textThankyouMessage)
      .should("be.visible")
      .and("have.text", this.thankyouMessage);
    cy.get(this.textOrderConfirmationMessage)
      .should("be.visible")
      .and("have.text", this.orderConfirmationMessage);
  }
}
