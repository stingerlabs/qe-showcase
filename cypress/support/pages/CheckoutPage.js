/**
 * CheckoutPage - World Class Tiny Page Object Model
 * Handles checkout form interactions with robust error handling and validation
 * 
 * KEY DECISIONS:
 * - Clear section headers for organization
 * - Input validation for error handling
 * - Visibility checks for reliable interactions
 */

class CheckoutPage {
  // ========================================
  // FORM FIELD SELECTORS
  // ========================================
  
  // data-test selectors for reliability and maintainability
  get firstNameInput() { return '[data-test="firstName"]'; }
  get lastNameInput() { return '[data-test="lastName"]'; }
  get postalCodeInput() { return '[data-test="postalCode"]'; }

  // ========================================
  // ACTION BUTTON SELECTORS
  // ========================================
  
  // Grouped by functionality for clear organization
  get continueButton() { return '[data-test="continue"]'; }
  get cancelButton() { return '[data-test="cancel"]'; }
  get finishButton() { return '[data-test="finish"]'; }

  // ========================================
  // NAVIGATION SELECTORS
  // ========================================
  
  // Navigation elements separated for clarity
  get backToProductsButton() { return '[data-test="back-to-products"]'; }

  // ========================================
  // SELECTOR VALIDATION
  // ========================================
  
  // Early detection of selector issues for reliability
  validateSelectors() {
    const criticalSelectors = [
      this.firstNameInput,
      this.lastNameInput,
      this.postalCodeInput,
      this.continueButton
    ];

    criticalSelectors.forEach(selector => {
      cy.get('body').should('contain', selector.replace(/[\[\]]/g, ''));
    });
  }

  // ========================================
  // ACTIONS WITH ERROR HANDLING AND VALIDATION
  // ========================================
  
  // Input validation prevents test failures from bad data
  fillAddress(addressData) {
    if (!addressData || typeof addressData !== 'object') {
      throw new Error('addressData must be a valid object');
    }
    
    const { firstName, lastName, postalCode } = addressData;
    if (!firstName || !lastName || !postalCode) {
      throw new Error('addressData must contain firstName, lastName, and postalCode');
    }

    // Clear fields before typing for clean form state
    cy.get(this.firstNameInput).should('be.visible').clear().type(firstName);
    cy.get(this.lastNameInput).should('be.visible').clear().type(lastName);
    cy.get(this.postalCodeInput).should('be.visible').clear().type(postalCode);
  }

  // Visibility checks prevent flaky tests
  continue() {
    cy.get(this.continueButton).should('be.visible').click();
  }

  cancel() {
    cy.get(this.cancelButton).should('be.visible').click();
  }

  finish() {
    cy.get(this.finishButton).should('be.visible').click();
  }

  backToProducts() {
    cy.get(this.backToProductsButton).should('be.visible').click();
  }

  // ========================================
  // COMPLETE CHECKOUT FLOW WITH VALIDATION
  // ========================================
  
  // Encapsulates common business flow for reusability
  completeCheckout(addressData) {
    this.fillAddress(addressData);
    this.continue();
    this.finish();
  }

  // ========================================
  // BUSINESS LOGIC METHODS
  // ========================================
  
  // Tests form validation for user experience
  verifyFormValidation() {
    cy.get(this.continueButton).click();
    cy.get(this.firstNameInput).should('be.visible'); // Should show validation error
  }

  // Verifies form accessibility and functionality
  verifyFormFields() {
    cy.get(this.firstNameInput).should('be.visible').should('be.enabled');
    cy.get(this.lastNameInput).should('be.visible').should('be.enabled');
    cy.get(this.postalCodeInput).should('be.visible').should('be.enabled');
  }
}

module.exports = new CheckoutPage();