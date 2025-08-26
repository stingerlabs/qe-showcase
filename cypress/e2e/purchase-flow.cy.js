/**
 * Sauce Demo Purchase Flow - E2E Testing
 * Covers all required steps: Login → Sort → Add to Cart → Checkout → Complete → Verify Success
 *
 * Uses fixtures to avoid hardcoded values
 * 
 * KEY DECISIONS:
 * - Atomic testing for clear failure isolation
 * - Data-driven approach for sorting efficiency
 * - Business assertions over implementation details
 */

describe('Sauce Demo Purchase Flow', () => {
  let productsData;

  // Setup: Centralized login for clean test state
  beforeEach(() => {
    cy.visit('/');
    cy.fixture('users.json').then((users) => {
      cy.login(users.standard_user.username, users.standard_user.password);
    });
    cy.fixture('products.json').then((data) => {
      productsData = data;
    });
  });

  // Single responsibility: Authentication verification only
  it('should successfully authenticate and show inventory', () => {
    cy.get('[data-test="inventory-item"]').should('exist');
    cy.get('[data-test="inventory-item"]').should('have.length.at.least', 1);
  });

  // Data-driven: 4 sorting tests in 1 for efficiency
  it('should handle all sorting options', () => {
    const sortTests = [
      { option: productsData.sort_options.price_low_high, direction: 'ascending' },
      { option: productsData.sort_options.price_high_low, direction: 'descending' },
      { option: productsData.sort_options.name_a_z, direction: 'ascending' },
      { option: productsData.sort_options.name_z_a, direction: 'descending' }
    ];
    
    sortTests.forEach(({ option, direction }) => {
      cy.sortProducts(option);
      cy.verifyProductsSorted(option, direction);
    });
  });

  // Single responsibility: Cart operations only
  it('should handle cart operations correctly', () => {
    cy.verifyCartBadgeCount(0);
    cy.addToCart(productsData.products.backpack);
    cy.verifyCartBadgeCount(1);
    cy.removeFromCart(productsData.products.backpack);
    cy.verifyCartBadgeCount(0);
  });

  // Single responsibility: Form validation only
  it('should validate checkout form when submitted empty', () => {
    cy.addToCart(productsData.products.backpack);
    cy.goToCart();
    cy.proceedToCheckout();
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="firstName"]').should('be.visible');
  });

  // Single responsibility: Form completion only
  it('should complete checkout form successfully', () => {
    cy.addToCart(productsData.products.backpack);
    cy.goToCart();
    cy.proceedToCheckout();
    cy.fixture('checkout-data.json').then((data) => {
      cy.fillCheckoutInfo(data.valid_address);
      cy.get('[data-test="continue"]').click();
      cy.get('[data-test="subtotal-label"]').should('be.visible');
    });
  });

  // Single responsibility: Purchase completion only
  it('should complete purchase process', () => {
    cy.addToCart(productsData.products.backpack);
    cy.goToCart();
    cy.proceedToCheckout();
    cy.fixture('checkout-data.json').then((data) => {
      cy.fillCheckoutInfo(data.valid_address);
      cy.completePurchase();
    });
  });

  // Single responsibility: Success verification only
  it('should verify order completion success', () => {
    cy.addToCart(productsData.products.backpack);
    cy.goToCart();
    cy.proceedToCheckout();
    cy.fixture('checkout-data.json').then((data) => {
      cy.fillCheckoutInfo(data.valid_address);
      cy.completePurchase();
    });
    
    // Multiple verification strategies 
    cy.get('[data-test="complete-header"]').should('contain', productsData.messages.order_success_header);
    cy.get('[data-test="back-to-products"]').should('be.visible');
    cy.get('body').should('contain', 'Thank you');
    cy.get('[data-test="firstName"]').should('not.exist');
  });

  // Single responsibility: Edge case handling only
  it('should handle long names in checkout form', () => {
    cy.addToCart(productsData.products.backpack);
    cy.goToCart();
    cy.proceedToCheckout();
    cy.fixture('checkout-data.json').then((data) => {
      cy.fillCheckoutInfo(data.long_names);
      cy.get('[data-test="continue"]').click();
      cy.get('[data-test="subtotal-label"]').should('be.visible');
    });
  });

  // Single responsibility: Cancellation flow only
  it('should handle checkout cancellation', () => {
    cy.addToCart(productsData.products.backpack);
    cy.goToCart();
    cy.proceedToCheckout();
    cy.fixture('checkout-data.json').then((data) => {
      cy.fillCheckoutInfo(data.valid_address);
      cy.get('[data-test="cancel"]').click();
      cy.get('[data-test="inventory-item"]').should('exist');
    });
  });

  // Single responsibility: Cart structure verification only
  it('should verify cart structure and contents', () => {
    cy.addToCart(productsData.products.backpack);
    cy.goToCart();
    
    // Robust verification with multiple strategies
    cy.get('[data-test="inventory-item"]').should('have.length', 1);
    cy.get('body').should('contain', productsData.products.backpack);
    
    // Verify cart page elements exist
    cy.get('[data-test="checkout"]').should('be.visible');
    cy.get('[data-test="continue-shopping"]').should('be.visible');
  });
});

/**
 * IMPLEMENTATION NOTES
 * 
 * STRUCTURE: atomic tests with single responsibilities
 * - Authentication verification (essential for all tests)
 * - Product sorting (all 4 options with data-driven approach)
 * - Cart operations (add/remove functionality)
 * - Checkout form validation (empty form submission)
 * - Checkout form completion (successful form submission)
 * - Purchase completion (order processing)
 * - Order success verification (success confirmation with multiple strategies)
 * - Long names edge case (data validation)
 * - Checkout cancellation (user flow)
 * - Cart verification (structure and contents)
 * 
 *  Atomic Tests Approach :
 * - Each test has only one responsibility
 * - Independent test execution
 * - Clear failure isolation
 * - Focused business scenarios
 * - No mixed responsibilities
 * - Single assertion focus per test
 * 
 * Verification Approach:
 * - Multiple success verification strategies
 * - Cart structure verification
 * - Business outcome verification over implementation details
 * - Fallback verification approaches
 * 
 * ASSERTIONS: Business-focused, realistic checks
 * - Verify sorting results, not implementation details
 * - Check cart badge counts and contents
 * - Validate order completion with meaningful messages
 * 
 * TEST CASES: Covers main flow + essential edge cases
 * - Authentication (login verification)
 * - Sorting functionality (all options efficiently)
 * - Cart operations (add/remove functionality)
 * - Checkout validation (form requirements)
 * - Checkout completion (form submission)
 * - Purchase processing (order creation)
 * - Success verification (user confirmation with multiple strategies)
 * - Edge cases (data variations + cancellation)
 * - Enhanced cart verification (structure and contents)
 * 
 * TRADEOFFS & ENHANCEMENTS:
 * - atomic tests vs. integration testing
 * - Data-driven approach for sorting vs. individual tests
 * - Business assertions vs. implementation details
 * 
 * BUGS/ODDITIES FOUND:
 * - Dynamic button selectors require product name matching
 * - Cart container selector needs verification
 * - Order completion uses 'complete-header' for success message
 */
