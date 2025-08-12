import { CartPage } from "./page-objects/CartPage";
import { CheckoutInfoPage } from "./page-objects/CheckoutInfoPage";
import { CheckoutOverviewPage } from "./page-objects/CheckoutOverviewPage";
import { LoginPage } from "./page-objects/LoginPage";
import { OrderConfirmationPage } from "./page-objects/OrderConfirmationPage";
import { ProductsPage } from "./page-objects/ProductsPage";

const cartPage = new CartPage();
const checkoutInfoPage = new CheckoutInfoPage();
const checkoutOverviewPage = new CheckoutOverviewPage();
const loginPage = new LoginPage();
const orderConfirmationPage = new OrderConfirmationPage();
const productsPage = new ProductsPage();

describe("Checkout Tests", () => {
  let productsFixture;

  beforeEach(() => {
    cy.fixture("products").then((data) => {
      productsFixture = data;
    });
    //Open the login page at the start of the first test
    loginPage.visit();
    loginPage.fillUsername("standard_user");
    loginPage.fillPassword("secret_sauce");
    loginPage.clickLogin();
  });

  describe("[Positive] Using static data from fixture - place an order successfully", () => {
    it("[Positive] Login and place an order with one or more random items", () => {
      productsPage.clickAddToCartByIndex(0);
      productsPage.clickAddToCartByIndex(4);
      productsPage.clickCartIcon();
      //Check cart contents
      productsFixture.forEach((product) => {
        cartPage.assertProductVisibleInCart(product.productName);
      });
      //Go to checkout
      cartPage.clickCheckoutButton();
      checkoutInfoPage.fillCustomerInformation("John", "Jay", "10011");
      checkoutInfoPage.clickContinueButton();
      //Check cart contents match the checkout overview page
      checkoutOverviewPage.assertProductsMatchBetweenCartAndOverview(
        productsFixture.map((product) => product.productName),
      );
      checkoutOverviewPage.clickFinishButton();
      orderConfirmationPage.assertOrderConfirmationMessages();
    });
  });

  describe("[Positive] More dynamic and better test - place an order successfully", () => {
    let selectedProductNames = [];
    it("[Positive] Login and place an order with one or more random items", () => {
      productsPage.clickSortLowToHigh();
      productsPage.assertProductsSortedLowToHigh();
      productsPage.selectRandomProducts(selectedProductNames);
      productsPage.clickCartIcon();
      //check cart for products to verify that only products where `Add to Cart` button was clicked is(are) present in the cart
      cy.then(() => {
        const pMap = Cypress.env("selectedProducts");
        Object.keys(pMap).forEach((pName) => {
          cartPage.assertProductVisibleInCart(pName);
        });
      });
      cartPage.clickCheckoutButton();
      checkoutInfoPage.fillCustomerInformation("Jane", "Jay", "10001");
      checkoutInfoPage.clickContinueButton();
      //Check cart contents match the checkout overview page
      checkoutOverviewPage.assertProductsMatchBetweenCartAndOverview(
        selectedProductNames,
      );
      checkoutOverviewPage.clickFinishButton();
      orderConfirmationPage.assertOrderConfirmationMessages();
    });
  });

  /**
   * More Test cases can be added. Some examples are:
   *
   * Negative tests
   * - Try to go to checkout page directly without adding items to cart
   * - Navigate to Order confirmation without entering customer information
   *
   * Positive tests
   * - Change item quanities in cart and validate totals in checkout
   * - Go back to each step in the checkout process and make changes
   */
});
