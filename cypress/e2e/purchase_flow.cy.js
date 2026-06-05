/**
 * End-to-end purchase flow for Sauce Demo (saucedemo.com).
 *
 * Specs delegate UI interaction to Page Objects so this file documents
 * business intent (what we protect) rather than selector mechanics (how we click).
 */
import LoginPage from "./pages/LoginPage";
import InventoryPage from "./pages/InventoryPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OverviewPage from "./pages/OverviewPage";
import ConfirmationPage from "./pages/ConfirmationPage";

describe("Sauce Demo — purchase flow", () => {
  /**
   * Happy path: validates the revenue-critical journey from login through
   * order confirmation, including cart state and checkout arithmetic.
   */
  describe("Happy path — complete purchase", () => {
    const checkoutCustomer = {
      firstName: "Alex",
      lastName: "Tester",
      postalCode: "10115",
    };

    it("logs in, buys the highest-priced item after sorting, and confirms the order", () => {
      // Step 1 — Authentication: without a valid session, no downstream step is trustworthy
      LoginPage.visit().assertOnPage().login();
      InventoryPage.assertOnPage();

      // Step 2 — Catalog: price (high → low) puts the most expensive SKU in the first row
      InventoryPage.sortByPriceHighToLow().addTopListedProductToCart();

      // Step 3 — Cart signal: badge "1" proves exactly one line item was queued client-side
      InventoryPage.assertCartBadgeCount(1).goToCart();
      CartPage.assertOnPage().assertItemCount(1).proceedToCheckout();

      // Step 4 — Customer data: required fields before the financial summary is shown
      CheckoutPage.assertOnPage()
        .fillCheckoutForm(
          checkoutCustomer.firstName,
          checkoutCustomer.lastName,
          checkoutCustomer.postalCode,
        )
        .continueToOverview();

      // Step 5 — Financial risk: recompute total from line items + tax before committing payment
      OverviewPage.assertOnPage().assertDisplayedTotalMatchesCalculation();

      OverviewPage.finishOrder();

      // Step 6 — Outcome: user must see an unambiguous success header (order accepted)
      ConfirmationPage.assertOnPage().assertSuccessHeader();
    });
  });

  /**
   * Failure mode: locked accounts must be rejected with a clear, exact error message.
   * Prevents silent failures where the user appears to proceed without inventory access.
   */
  describe("Failure mode — locked-out user", () => {
    it("rejects locked_out_user and surfaces the exact error container text", () => {
      LoginPage.visit()
        .assertOnPage()
        .login(LoginPage.lockedOutUser.username, LoginPage.lockedOutUser.password);

      // User must remain on login; inventory URL would indicate an authorization bug
      LoginPage.assertRemainsOnLogin();

      // Full string match on [data-test="error"] — catches partial or missing error copy
      LoginPage.assertLockedOutError();
    });
  });
});
