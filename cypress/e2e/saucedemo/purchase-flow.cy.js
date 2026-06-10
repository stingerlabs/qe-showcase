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
    cy.fixture("saucedemo/users").then(({ standard }) => cy.loginAs(standard));

    // Login landed on the inventory page with products rendered.
    cy.url().should("include", "/inventory.html");
    cy.getByDataTest("inventory-list").should("be.visible");

    // SauceDemo's catalog is a fixed 6-item demo dataset, so an exact count
    // is a deterministic "the page rendered completely" check here. Against
    // a real store this would assert "> 0" or pin against a seeded dataset.
    cy.getByDataTest("inventory-item").should("have.length", 6);

    // Sort by price high → low and verify the *result*, not just the action:
    // extract every displayed price and assert the actual numeric order.
    // (Select and assert as separate queries — the app re-renders the select
    // on change, which would detach a chained subject.)
    cy.getByDataTest("product-sort-container").select("hilo");
    cy.getByDataTest("product-sort-container").should("have.value", "hilo");
    // .should(callback) retries until the re-sorted list settles, unlike .then.
    cy.getByDataTest("inventory-item-price").should(($prices) => {
      expectSortedDescending(textsOf($prices).map(parseUsdToCents));
    });

    // Capture the top (most expensive) product so every later step can be
    // checked against what was really selected, not a hardcoded product.
    const chosen = {};
    cy.getByDataTest("inventory-item")
      .first()
      .within(() => {
        cy.getByDataTest("inventory-item-name")
          .invoke("text")
          .then((name) => (chosen.name = name.trim()));
        cy.getByDataTest("inventory-item-price")
          .invoke("text")
          .then((price) => (chosen.cents = parseUsdToCents(price)));

        cy.get('button[data-test^="add-to-cart"]').click();
        // The button swapping to "Remove" confirms the click registered in
        // the app state, not just that the click happened.
        cy.get('button[data-test^="remove"]').should("be.visible");
      });

    cy.getByDataTest("shopping-cart-badge").should("have.text", "1");

    // Cart holds exactly the selected product: right name, qty 1, right price.
    cy.getByDataTest("shopping-cart-link").click();
    cy.url().should("include", "/cart.html");
    cy.getByDataTest("inventory-item").should("have.length", 1);
    cy.getByDataTest("item-quantity").should("have.text", "1");
    cy.getByDataTest("inventory-item-name").then(($name) => {
      expect($name.text().trim()).to.equal(chosen.name);
    });
    cy.getByDataTest("inventory-item-price").then(($price) => {
      expect(parseUsdToCents($price.text())).to.equal(chosen.cents);
    });

    // Checkout: customer details come from a fixture to keep test data in
    // one obvious place.
    cy.getByDataTest("checkout").click();
    cy.url().should("include", "/checkout-step-one.html");
    cy.fixture("saucedemo/checkout-customer").then((customer) => {
      cy.getByDataTest("firstName").type(customer.firstName);
      cy.getByDataTest("lastName").type(customer.lastName);
      cy.getByDataTest("postalCode").type(customer.postalCode);
    });
    cy.getByDataTest("continue").click();

    // Overview still shows the same product at the same price — guards
    // against the classic "cart and checkout disagree" bug.
    cy.url().should("include", "/checkout-step-two.html");
    cy.getByDataTest("inventory-item-name").then(($name) => {
      expect($name.text().trim()).to.equal(chosen.name);
    });
    cy.getByDataTest("inventory-item-price").then(($price) => {
      expect(parseUsdToCents($price.text())).to.equal(chosen.cents);
    });
    cy.getByDataTest("payment-info-value").should("be.visible").and("not.be.empty");
    cy.getByDataTest("shipping-info-value").should("be.visible").and("not.be.empty");

    // Order math, in integer cents (no float rounding surprises):
    // subtotal must equal the selected item's price, and total must equal
    // subtotal + tax exactly. The tax *rate* is intentionally not asserted —
    // it's not a documented business rule of this demo app.
    cy.getByDataTest("subtotal-label")
      .invoke("text")
      .then((subtotalText) => {
        const subtotal = parseUsdToCents(subtotalText);
        expect(subtotal, "subtotal equals the selected item price").to.equal(chosen.cents);

        cy.getByDataTest("tax-label")
          .invoke("text")
          .then((taxText) => {
            const tax = parseUsdToCents(taxText);
            cy.getByDataTest("total-label")
              .invoke("text")
              .then((totalText) => {
                expect(parseUsdToCents(totalText), "total = subtotal + tax").to.equal(
                  subtotal + tax
                );
              });
          });
      });

    // Complete the order and verify the success state the user actually sees.
    cy.getByDataTest("finish").click();
    cy.url().should("include", "/checkout-complete.html");
    cy.getByDataTest("complete-header").should("have.text", "Thank you for your order!");
    cy.getByDataTest("complete-text").should("be.visible");

    // Back to shopping: the cart was consumed by the order, so no badge.
    cy.getByDataTest("back-to-products").click();
    cy.url().should("include", "/inventory.html");
    cy.getByDataTest("shopping-cart-badge").should("not.exist");
  });
});
