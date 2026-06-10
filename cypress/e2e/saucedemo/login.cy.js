// Negative login coverage. The happy login path is already exercised (and
// asserted) at the start of the purchase flow, so this spec focuses on the
// access-control failure mode that matters most: a locked-out account must
// be told why it can't get in, and must not reach the store.
describe("SauceDemo login", () => {
  it("locked-out user is rejected with an explicit lockout message and stays on the login page", () => {
    cy.fixture("saucedemo/users").then(({ lockedOut }) => cy.loginAs(lockedOut));

    // Exact message, not just "an error is shown": a wrong-credentials
    // message here would be a real bug (the account exists; it's locked).
    cy.getByDataTest("error").should(
      "have.text",
      "Epic sadface: Sorry, this user has been locked out."
    );

    // Still on the login page, with no route into the inventory.
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    cy.getByDataTest("login-button").should("be.visible");
    cy.getByDataTest("inventory-list").should("not.exist");
  });
});
