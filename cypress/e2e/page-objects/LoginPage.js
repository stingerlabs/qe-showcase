/**
 * Page object for the Login Page
 *
 * @class LoginPage
 * @description Methods for interacting with the Login Page
 */
export class LoginPage {
  // Locators
  // Using different ways to show usage of css selectors
  inputUsernameLocator = '[data-test="username"]';
  inputPasswordLocator = '[data-test="password"]';
  textErrorLocator = '[data-test="error"]';
  buttonloginLocator = '[data-test="login-button"]';
  textUsernamesLocator = "#login_credentials";
  textPasswordLocator = '[data-test="login-password"]';

  visit() {
    cy.visit("https://www.saucedemo.com");
  }

  fillUsername(username) {
    cy.get(this.inputUsernameLocator).type(username);
  }

  fillPassword(password) {
    cy.get(this.inputPasswordLocator).type(password);
  }

  clickLogin() {
    cy.get(this.buttonloginLocator).click();
  }

  assertUsernameMissingErrorPresent() {
    cy.get(this.textErrorLocator, { timeout: 10000 }).should(
      "have.text",
      "Epic sadface: Username is required",
    );
  }

  assertPasswordMissingErrorPresent() {
    cy.get(this.textErrorLocator, { timeout: 10000 }).then((elem) => {
      const actualText = elem.text();
      //Cypress assertion
      expect(actualText).to.equal("Epic sadface: Password is required");
    });
  }

  assertUserLockedErrorPresent() {
    cy.get(this.textErrorLocator).should("be.visible");
    //Demonstrating Chai assertion
    expect(this.extErrorLocator).to.include(
      "Epic sadface: Sorry, this user has been locked out.",
    );
  }

  assertUsernamePasswordDoesNotMatchErrorPresent() {
    cy.get(this.textErrorLocator).should("be.visible");
    //Cypress style assertion
    cy.get(this.textErrorLocator).should(
      "contain.text",
      "Epic sadface: Username and password do not match any user in this service",
    );
  }
}
