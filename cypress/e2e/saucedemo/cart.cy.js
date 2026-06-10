// Cart removal: the inverse of "add to cart". A stale badge or a ghost line
// item after removal directly corrupts what the user is about to pay for.
describe("SauceDemo cart", () => {
  it("removing the only item empties the cart and clears the badge", () => {
    cy.fixture("saucedemo/users").then(({ standard }) => cy.loginAs(standard));
    cy.addFirstInventoryItemToCart();

    cy.getByDataTest("shopping-cart-link").click();
    cy.url().should("include", "/cart.html");
    cy.getByDataTest("inventory-item").should("have.length", 1);

    cy.get('button[data-test^="remove"]').click();

    // Both signals must agree: no line items left AND no badge on the cart
    // icon. Checking only one can pass while the other lies to the user.
    cy.getByDataTest("inventory-item").should("not.exist");
    cy.getByDataTest("shopping-cart-badge").should("not.exist");
  });
});
