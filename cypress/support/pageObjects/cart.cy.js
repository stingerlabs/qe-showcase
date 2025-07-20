
class Cart 
{
    verifyCart (expectedProductName,expectedQuantity) 
    {
        // Cart verification 
        cy.get('.cart_item').should('have.length', expectedQuantity)
        cy.get('.cart_item_label').should('contain.text', expectedProductName)
    }
    checkout () 
    {
     // Click checkout and also ensure url to confirm navigating
        cy.get('#checkout').should('be.visible').and('not.be.disabled').click()
        cy.url().should('include', '/checkout-step-one')
    }
}

export default Cart