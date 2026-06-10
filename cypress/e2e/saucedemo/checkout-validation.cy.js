const {
  loginPage,
  inventoryPage,
  cartPage,
  checkoutInfoPage,
  header,
} = require("../../pages");

// Checkout form validation. One deterministic walk through the required-field
// errors in the order the app reports them (first name → last name → postal
// code). Each submit asserts the *specific* message so a regression that
// swaps or genericises the errors is caught, not just "some error appeared".
describe("SauceDemo checkout information validation", () => {
  beforeEach(() => {
    cy.fixture("saucedemo/users").then(({ standard }) => loginPage.loginAs(standard));
    inventoryPage.addFirstItemToCart();
    header.openCart();
    cartPage.checkout();
    checkoutInfoPage.assertLoaded();
  });

  it("requires first name, last name and postal code, validated in order", () => {
    // Empty form → first name is the first missing field reported.
    checkoutInfoPage.submit();
    checkoutInfoPage.errorMessage().should("have.text", "Error: First Name is required");

    // First name alone is not enough.
    checkoutInfoPage.typeFirstName("Ada");
    checkoutInfoPage.submit();
    checkoutInfoPage.errorMessage().should("have.text", "Error: Last Name is required");

    // First + last name still blocked on postal code.
    checkoutInfoPage.typeLastName("Lovelace");
    checkoutInfoPage.submit();
    checkoutInfoPage.errorMessage().should("have.text", "Error: Postal Code is required");

    // Throughout, the user must never advance to the overview step.
    checkoutInfoPage.assertLoaded();
  });
});
