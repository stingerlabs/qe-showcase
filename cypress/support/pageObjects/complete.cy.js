class Complete
{
    verifyComplete()
    {
        // Validating success page
        cy.get('.pony_express').should('be.visible')
        cy.get('.complete-header').should('be.visible').should('have.text', 'Thank you for your order!')
       
    }
}  

export default Complete