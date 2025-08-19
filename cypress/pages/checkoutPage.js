class CheckoutPage {
    // Fill out checkout form with user info
    fillInfo(firstName, lastName, zip) {
        cy.get('[data-test="firstName"]').type(firstName)
        cy.get('[data-test="lastName"]').type(lastName)
        cy.get('[data-test="postalCode"]').type(zip)
    }

    // Click the Continue button (Step one)
    clickContinue() {
        cy.get('[data-test="continue"]').should('be.visible').click()
    }

    // Click Cancel to stop the checkout process
    cancel() {
        cy.get('[data-test="cancel"]').click()
    }

    // Verify user is on Step One page
    verifyStepOnePage() {
        cy.url().should('include', '/checkout-step-one')
    }

    // Click the Finish button
    finish() {
        cy.get('[data-test="finish"]').click()
    }

    // Verify user is on the Final Check-out page
    verifyCompletePage() {
        cy.url().should('include', '/checkout-complete')
    }

    // Verify text is correct and complete
    verifyConfirmation(expectedText) {
        cy.get('.complete-text').invoke('text').then((text) => {
            expect(text.trim().toLowerCase()).to.contain(expectedText.toLowerCase())
        })
    }

    // Verify form fields are visible before typing
    verifyFormFieldsVisible() {
        cy.get('[data-test="firstName"]').should('be.visible')
        cy.get('[data-test="lastName"]').should('be.visible')
        cy.get('[data-test="postalCode"]').should('be.visible')
    }

    // Verify user is back on cart page
    verifyBackOnCartPage() {
        cy.url().should('include', '/cart')
    }

    // Verify confirmation message is visible
    verifyConfirmationVisible() {
        cy.get('.complete-text').should('be.visible')
    }

    // Verify item and price on Check-out step two page
    verifyStepTwoPage(itemName, expectedPrice) {
        cy.get('.cart_item').should('contain', itemName)
        cy.get('.inventory_item_price').should('contain', expectedPrice)
    }

}

export default new CheckoutPage()
