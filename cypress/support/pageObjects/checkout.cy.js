class Checkout 
{
    fillInformation (Fname, Lname, postalcode) // data comes from Tests so function is reusable
    {
        cy.get('[data-test="firstName"]').type(Fname)
        cy.get('[data-test="lastName"]').type(Lname)
        cy.get('[data-test="postalCode"]').type(postalcode)
        cy.get('#continue').should('be.visible').and('not.be.disabled').click()
        cy.url().should('include', '/checkout-step-two')         //checking if click was successful
    }

}

export default Checkout