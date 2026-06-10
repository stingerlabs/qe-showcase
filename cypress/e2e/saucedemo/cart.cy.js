const { loginPage, inventoryPage, cartPage, header } = require("../../pages");

// Cart removal: the inverse of "add to cart". A stale badge or a ghost line
// item after removal directly corrupts what the user is about to pay for.
describe("SauceDemo cart", () => {
  it("removing the only item empties the cart and clears the badge", () => {
    cy.fixture("saucedemo/users").then(({ standard }) => loginPage.loginAs(standard));
    inventoryPage.addFirstItemToCart();

    header.openCart();
    cartPage.assertLoaded();
    cartPage.items().should("have.length", 1);

    cartPage.removeFirstItem();

    // Both signals must agree: no line items left AND no badge on the cart
    // icon. Checking only one can pass while the other lies to the user.
    cartPage.items().should("not.exist");
    header.cartBadge().should("not.exist");
  });
});
