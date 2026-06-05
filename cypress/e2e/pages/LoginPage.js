/**
 * Login page object — entry point for authenticated flows.
 *
 * Locators use data-test attributes only (Sauce Demo contract). They survive
 * CSS/theme refactors better than classes or XPath.
 */
class LoginPage {
  // Selector map: one place to update when the app changes test hooks
  selectors = {
    username: '[data-test="username"]',
    password: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    error: '[data-test="error"]',
  };

  defaultUser = {
    username: "standard_user",
    password: "secret_sauce",
  };

  lockedOutUser = {
    username: "locked_out_user",
    password: "secret_sauce",
  };

  /** Exact copy from [data-test="error"] when locked_out_user signs in */
  lockedOutErrorMessage =
    "Epic sadface: Sorry, this user has been locked out.";

  visit() {
    cy.visit("/");
    return this;
  }

  fillUsername(username) {
    cy.get(this.selectors.username).clear().type(username);
    return this;
  }

  fillPassword(password) {
    cy.get(this.selectors.password).clear().type(password);
    return this;
  }

  submit() {
    cy.get(this.selectors.loginButton).click();
    return this;
  }

  login(username = this.defaultUser.username, password = this.defaultUser.password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.submit();
    return this;
  }

  assertOnPage() {
    cy.get(this.selectors.username).should("be.visible");
    cy.get(this.selectors.password).should("be.visible");
    cy.get(this.selectors.loginButton).should("be.visible");
    return this;
  }

  /** Stays on login — use for negative paths that must not reach inventory */
  assertRemainsOnLogin() {
    cy.url().should("not.include", "inventory");
    this.assertOnPage();
    return this;
  }

  assertErrorMessage(expectedMessage) {
    cy.get(this.selectors.error)
      .should("be.visible")
      .and("have.text", expectedMessage);
    return this;
  }

  assertLockedOutError() {
    return this.assertErrorMessage(this.lockedOutErrorMessage);
  }
}

export default new LoginPage();
