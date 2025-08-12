/**
 * Page object for the Products Page
 *
 * @class ProductsPage
 * @description Methods for interacting with the Products Page
 */
export class ProductsPage {
  // Locators
  // Using different ways to show usage of css selectors
  buttonAddSauceLabsBackpack = '[data-test="add-to-cart-sauce-labs-backpack"]';
  buttonAddSauceLabsBikeLight =
    '[data-test="add-to-cart-sauce-labs-bike-light"]';
  buttonAddSauceLabsBoltTShirt =
    '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]';
  buttonAddSauceLabsFleeceJacket =
    '[data-test="add-to-cart-sauce-labs-fleece-jacket"]';
  buttonAddSauceLabsOnesie = '[data-test="add-to-cart-sauce-labs-onesie"]';
  buttonAddTestAllTheThingsShirt =
    '[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]';
  cartIcon = '[data-test="shopping-cart-link"]';
  dropDownSort = '[data-test="product-sort-container"]';
  dropDownLowToHighOption = 'option[value="lohi"]';
  buttonAddToCart = ".btn_inventory";
  textCartCount = '[data-test="shopping-cart-badge"]';
  textItemPrice = ".inventory_item_price";
  textProductName = ".inventory_item_name";
  textProductPrice = ".inventory_item_price";

  clickCartIcon() {
    cy.get(this.cartIcon).click();
  }

  clickAddToCartByIndex(productIndex) {
    cy.get(this.buttonAddToCart).eq(productIndex).click();
  }

  clickSortLowToHigh() {
    cy.get(this.dropDownSort).select("Price (low to high)");
  }

  assertCartCountUpdated(count) {
    cy.get(this.textCartCount).to.equal(count);
  }

  assertProductsSortedLowToHigh() {
    cy.get(this.textItemPrice).then(($items) => {
      const itemPrices = [...$items].map((e) =>
        parseFloat(e.innerText.replace("$", "").trim()),
      );
      const sortedPrices = [...itemPrices].sort((x, y) => x - y);
      expect(itemPrices).to.deep.equal(sortedPrices);
    });
  }

  selectRandomProducts(selectedProductNames) {
    let selectedProductsMap = {};

    cy.get(this.textProductName).then(($elems) => {
      const allProductNames = [...$elems].map((e) => e.innerText.trim());
      const randomNumOfProducts =
        Math.floor(Math.random() * allProductNames.length) + 1;
      const shuffledProductNames = allProductNames.sort(
        () => 0.5 - Math.random(),
      );

      selectedProductNames = shuffledProductNames.slice(0, randomNumOfProducts);

      //Iterate through all selected products; save their details in environment variable; add them to cart
      for (let i = 0; i < selectedProductNames.length; i++) {
        const productName = selectedProductNames[i];
        const productIndex = allProductNames.indexOf(productName);
        cy.get(this.textProductPrice)
          .eq(i)
          .invoke("text")
          .then((p) => {
            const formattedPrice = p.replace("$", "").trim();
            selectedProductsMap[productName] = formattedPrice;
            Cypress.env("selectedProducts", selectedProductsMap);
          });

        cy.get(this.buttonAddToCart).eq(productIndex).click();
      }
    });
  }
}
