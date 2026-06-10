// Checkout form validation. One deterministic walk through the required-field
// errors in the order the app reports them (first name → last name → postal
// code). Each submit asserts the *specific* message so a regression that
// swaps or genericises the errors is caught, not just "some error appeared".
describe("SauceDemo checkout information validation", () => {
  beforeEach(() => {
    cy.fixture("saucedemo/users").then(({ standard }) => cy.loginAs(standard));
    cy.addFirstInventoryItemToCart();
    cy.getByDataTest("shopping-cart-link").click();
    cy.getByDataTest("checkout").click();
    cy.url().should("include", "/checkout-step-one.html");
  });

  it("requires first name, last name and postal code, validated in order", () => {
    // Empty form → first name is the first missing field reported.
    cy.getByDataTest("continue").click();
    cy.getByDataTest("error").should("have.text", "Error: First Name is required");

    // First name alone is not enough.
    cy.getByDataTest("firstName").type("Ada");
    cy.getByDataTest("continue").click();
    cy.getByDataTest("error").should("have.text", "Error: Last Name is required");

    // First + last name still blocked on postal code.
    cy.getByDataTest("lastName").type("Lovelace");
    cy.getByDataTest("continue").click();
    cy.getByDataTest("error").should("have.text", "Error: Postal Code is required");

    // Throughout, the user must never advance to the overview step.
    cy.url().should("include", "/checkout-step-one.html");
  });
});
