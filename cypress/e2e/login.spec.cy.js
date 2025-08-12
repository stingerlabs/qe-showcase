import { LoginPage } from "./page-objects/LoginPage";

describe("Login Tests", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    //Open the login page before each test
    loginPage.visit();
  });

  it("[Negative] Username missing error should be displayed", () => {
    loginPage.clickLogin();
    loginPage.assertUsernameMissingErrorPresent();
  });

  it("[Negative] Password missing error should be displayed", () => {
    loginPage.fillUsername("standard_user");
    loginPage.clickLogin();
    loginPage.assertPasswordMissingErrorPresent();
  });

  it("[Negative] Username Password not matching error should be displayed", () => {
    loginPage.fillUsername("standard_user");
    loginPage.fillPassword("invalid");
    loginPage.clickLogin();
    loginPage.assertUsernamePasswordDoesNotMatchErrorPresent();
  });

  it("[Poisitve] At Least one user name is visible on the login page", () => {
    cy.contains("standard_user");
  });
});
