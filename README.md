# Cypress End-to-End Automation Solution: Checkout Flow

## Solution Overview

This project contains an end-to-end automated test for the *SauceDemo* sample web application, starting from login, adding product, checkout till order completion. The solution is implemented using *Cypress* with a *Page Object Model (POM)* structure for scalability and code maintainability.

## Project Structure

cypress/
├── e2e/
│ └── e2etest.cy.js # Main test script (E2E checkout flow)
├── support/
│ └── pageObjects/ # Page classes for POM implementation
│   ├── loginPage.cy.js
│   ├── products.cy.js
│   ├── cart.cy.js
│   ├── checkout.cy.js
│   ├── checkoutOverview.cy.js
│   └── complete.cy.js
├── fixtures/
│ └── e2eTestdata.json # Test data for input
cypress.config.js # Cypress project configuration
README.md # Solution overview (this file)

---

##  Key Features

- **Framework:** Cypress
- **Design Pattern:** Page Object Model (POM)
- **Test Coverage:** Full checkout flow including:
  - Login
  - Product sorting and selection
  - Cart verification
  - Checkout process
  - Order confirmation

- **Assertions:**  
  Post-action assertions, confirm navigations and system feedback after critical steps

- **Parameterization:**  
  Login credentials, product name and customer data are passed as inputs for the test

- **Modularity:**  
  UI interactions are encapsulated in page classes, improving readability and maintainability.

---

## Solution Approach

- The test script interacts with page classes using a clean, modular approach.
- Login credtials, Produc name and Checkout information are parameterized.
- Assertions validate UI navigation, content visibility, and success messages.
- The solution focuses on clear structure, readability, and end to end flow. 

---

## Improvements (Future Enhancements)

- Extend product addition to support multiple products using loops or data-driven approach.
- Add more test cases like, Add / remove products and check totals.
- Navigating back and forward between and verify products added to Cart are not removed for example.
- Solution is implemented for Standard_user only, can be extended for other users.
- Add negative test scenarios and edge-case validations.
- Passing url from test script, Env variable can be created to execute in different environments.
- I tried mochawesome reporter, other reportings can be used as well.
- Implement CI/CD pipeline execution using GitHub Actions or Jenkins.
- Expand API-layer testing for extensive testing as applicable.

---

## Setup Instructions

1. Clone this repository: git clone https://github.com/SureshSJ19/qe-showcase.git
2. Install dependencies (npm, npx etc if applicable)
3. Run e2etest in Cypress test runner. 
Note: Any unexpected pop-ups, notifications are not handled, so exercise caution while running or choose electron browser.

---

## Thank You!!!
I appreciate the opportunity to share my solution. Looking forward to feedback and suggestions.