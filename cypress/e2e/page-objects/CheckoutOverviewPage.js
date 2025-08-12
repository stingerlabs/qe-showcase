import { StringUtils } from "../../support/helpers/StringUtils";

/**
 * Page object for the Checkout Overview Page
 *
 * @class CheckoutOverviewPage
 * @description Methods for interacting with the Checkout Overview Page
 */
export class CheckoutOverviewPage {
  // Locators
  // Using different ways to show usage of css selectors
  buttonFinish = '[data-test="finish"]';
  textProductName = ".inventory_item_name";
  textTotal = '[data-test="total-label"]';

  clickFinishButton() {
    cy.get(this.buttonFinish).click();
  }

  assertCartTotalMatchesOverviewTotal(cartTotal) {
    cy.get(this.textTotal)
      .invoke("text")
      .then((checkoutTotal) => {
        expect(checkoutTotal).to.equal(cartTotal);
      });
  }

  assertProductsMatchBetweenCartAndOverview(cartItems) {
    cy.get(this.textProductName).then(($elems) => {
      const productsInCheckout = [...$elems].map((e) =>
        StringUtils.normalize(e.innerText.trim()),
      );
      cartItems.forEach((e) => {
        expect(productsInCheckout).to.include(e);
      });
    });
  }
}
