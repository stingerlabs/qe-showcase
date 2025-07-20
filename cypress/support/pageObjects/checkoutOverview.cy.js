class CheckoutConfirmation
{
    verifyOverview()
    {
        // verifying product, payment infor and summary total is present and not blank, not actually validating the numbers
        cy.get('.cart_item').should('be.visible').should('have.length',1)
        cy.get('[data-test="payment-info-value"]').should('be.visible').should('not.be.empty')
        cy.get('.summary_total_label').should('be.visible').should('not.be.empty')
    }

    clickfinish()
    {
        // Clicking finish button and ensuring page navigation
        cy.get('#finish').should('be.visible').and('not.be.disabled').click()
        cy.url().should('include', '/checkout-complete')
    }
}

export default CheckoutConfirmation