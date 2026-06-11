const {
  loginPage,
  inventoryPage,
  cartPage,
  checkoutInfoPage,
  checkoutOverviewPage,
  checkoutCompletePage,
  header,
} = require("../../pages");
const {
  parseUsdToCents,
  textsOf,
  expectSortedDescending,
} = require("../../support/helpers");

// End-to-end purchase flow: the single highest-risk user journey on the site.
// If this breaks, the shop makes no money — so it gets the deepest assertions:
// real sort-order verification, cart content checks against the product that
// was actually selected, and order-total math (subtotal + tax = total) done
// in integer cents.
describe("SauceDemo purchase flow", () => {
  it("standard user buys the most expensive product end to end", () => {
    cy.fixture("saucedemo/users").then(({ standard }) => loginPage.loginAs(standard));

    // Login landed on the inventory page with products rendered.
    inventoryPage.assertLoaded();

    // SauceDemo's catalog is a fixed 6-item demo dataset, so an exact count
    // is a deterministic "the page rendered completely" check here. Against
    // a real store this would assert "> 0" or pin against a seeded dataset.
    inventoryPage.items().should("have.length", 6);

    // Sort by price high → low and verify the *result*, not just the action:
    // extract every displayed price and assert the actual numeric order.
    // .should(callback) retries until the re-sorted list settles, unlike .then.
    inventoryPage.sortBy("hilo");
    inventoryPage.itemPrices().should(($prices) => {
      expectSortedDescending(textsOf($prices).map(parseUsdToCents));
    });

    // Capture the top (most expensive) product so every later step can be
    // checked against what was really selected, not a hardcoded product.
    const chosen = {};
    inventoryPage.captureFirstItemDetails(chosen);
    inventoryPage.addFirstItemToCart();

    // Cart holds exactly the selected product: right name, qty 1, right price.
    header.openCart();
    cartPage.assertLoaded();
    cartPage.items().should("have.length", 1);
    cartPage.itemQuantity().should("have.text", "1");
    cartPage.itemName().then(($name) => {
      expect($name.text().trim()).to.equal(chosen.name);
    });
    cartPage.itemPrice().then(($price) => {
      expect(parseUsdToCents($price.text())).to.equal(chosen.cents);
    });

    // Checkout: customer details come from a fixture to keep test data in
    // one obvious place.
    cartPage.checkout();
    checkoutInfoPage.assertLoaded();
    cy.fixture("saucedemo/checkout-customer").then((customer) => {
      checkoutInfoPage.fillCustomer(customer);
    });
    checkoutInfoPage.submit();

    // Overview still shows the same product at the same price — guards
    // against the classic "cart and checkout disagree" bug.
    checkoutOverviewPage.assertLoaded();
    checkoutOverviewPage.itemName().then(($name) => {
      expect($name.text().trim()).to.equal(chosen.name);
    });
    checkoutOverviewPage.itemPrice().then(($price) => {
      expect(parseUsdToCents($price.text())).to.equal(chosen.cents);
    });
    checkoutOverviewPage.paymentInfo().should("be.visible").and("not.be.empty");
    checkoutOverviewPage.shippingInfo().should("be.visible").and("not.be.empty");

    // Order math, in integer cents (no float rounding surprises):
    // subtotal must equal the selected item's price, and total must equal
    // subtotal + tax exactly. The tax *rate* is intentionally not asserted —
    // it's not a documented business rule of this demo app.
    const totals = {};
    checkoutOverviewPage.subtotalCents().then((subtotal) => (totals.subtotal = subtotal));
    checkoutOverviewPage.taxCents().then((tax) => (totals.tax = tax));
    checkoutOverviewPage.totalCents().then((total) => {
      expect(totals.subtotal, "subtotal equals the selected item price").to.equal(chosen.cents);
      expect(total, "total = subtotal + tax").to.equal(totals.subtotal + totals.tax);
    });

    // Complete the order and verify the success state the user actually sees.
    checkoutOverviewPage.finish();
    checkoutCompletePage.assertLoaded();
    checkoutCompletePage.successHeader().should("have.text", "Thank you for your order!");
    checkoutCompletePage.successMessage().should("be.visible");

    // Back to shopping: the cart was consumed by the order, so no badge.
    checkoutCompletePage.backToProducts();
    inventoryPage.assertLoaded();
    header.cartBadge().should("not.exist");
  });
});
