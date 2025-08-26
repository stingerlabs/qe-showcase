/**
 * LoginPage - Minimal Page Object Model
 * Just selectors and 1-2 essential actions per page
 */

class LoginPage {
  // Selectors
  get usernameInput() { return '[data-test="username"]'; }
  get passwordInput() { return '[data-test="password"]'; }
  get loginButton() { return '[data-test="login-button"]'; }
  get errorMessage() { return '[data-test="error"]'; }

  // Actions
  signIn(username, password) {
    cy.get(this.usernameInput).type(username);
    cy.get(this.passwordInput).type(password);
    cy.get(this.loginButton).click();
  }

  assertErrorMessage(expectedMessage) {
    cy.get(this.errorMessage).should('contain', expectedMessage);
  }
}

module.exports = new LoginPage();
