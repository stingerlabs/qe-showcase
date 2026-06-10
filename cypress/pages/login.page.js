class LoginPage {
  visit() {
    cy.visit("/");
    this.assertLoaded();
  }

  /** The login form is the page's reason to exist — its button is the load signal. */
  assertLoaded() {
    cy.getByDataTest("login-button").should("be.visible");
  }

  /**
   * Log in through the real form (no cookie/localStorage shortcuts — login is
   * part of the behaviour under test for this exercise).
   */
  loginAs({ username, password }) {
    this.visit();
    cy.getByDataTest("username").type(username);
    cy.getByDataTest("password").type(password, { log: false });
    cy.getByDataTest("login-button").click();
  }

  errorMessage() {
    return cy.getByDataTest("error");
  }

  /** Rejected logins must leave the user exactly where they started. */
  assertStillOnLoginPage() {
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    this.assertLoaded();
  }
}

module.exports = new LoginPage();
