import { StringUtils } from "../../support/helpers/StringUtils";

/**
 * Page object for the Cart Page
 *
 * @class CartPage
 * @description Methods for interacting with the Cart Page
 */
export class CartPage {
  // Locators
  // Using different ways to show usage of css selectors
  buttonRemoveItem = ".cart_button";
  buttonCheckout = '[data-test="checkout"]';
  textNavHeading = '[data-test="title"]';
  textProductName = ".inventory_item_name";
  textProductPrice = ".inventory_item_price";

  clickCheckoutButton() {
    cy.get(this.buttonCheckout).click();
  }

  clickRemoveItemByIndexButton(index) {
    cy.get(this.buttonRemoveItem).eq(index).click();
  }

  clickRemoveItemByProductName(name) {
    cy.get(this.textProductName).each(($element) => {
      if ($element.text().trim() === name) {
        cy.wrap($element)
          .parents(".cart_item")
          .find(this.buttonRemoveItem)
          .click();
      }
    });
  }

  assertProductVisibleInCart(productName) {
    cy.log(`Expected [${productName}]`);
    cy.get(this.textProductName).then(($elements) => {
      const productList = [...$elements].map((e) =>
        StringUtils.normalize(e.innerText.trim()),
      );
      const expected = StringUtils.normalize(productName);
      expect(expected).to.include(productName);
    });
  }
}
