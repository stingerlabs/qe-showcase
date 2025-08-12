# QE Showcase

## Submission
* Ahmed Siddiqui
* 08/11/2025

## Considerations
* Shows usage of config based runs for different environments.
  * For example: `npx cypress open --env ENVIRONMENT=prod`
* Uses Page Object Model
* Uses Test Fixtures
* Use of cypress and Chai based assertions
* Positive and Negative test cases
* Added some documentation
* Use of helper classes
* Usage of Cypress's environment variables

## Improvements
Due to lack of time these items could not be added.

### Documentation
* More documentation for methods/functions
* Data driven tests for more user accounts
* Use of faker library for randomized data

### Test Cases
More Test cases can be added. Some examples are:
* Negative tests
  1. Try to go to checkout page directly without adding items to cart
  2. Navigate to Order confirmation without entering customer information
* Positive tests
  1. Change item quanities in cart and validate totals in checkout
  2. Go back to each step in the checkout process and make changes
  3. Image visibility for products pages
  4. Product details page tests

### Browser Based Configurations
* Consider adding individual browser configs if there is a use case.
* Alternatively read browser at run time through the config e.g. `npx cypress run --browser firefox`
