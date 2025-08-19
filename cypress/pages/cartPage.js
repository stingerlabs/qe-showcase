class CartPage {
    // Bring user to cart
    goToCart() {
        cy.get('.shopping_cart_link').click()
        cy.url().should('include', '/cart')
    }

    // Click the checkout button
    startCheckout() {
        cy.get('[data-test="checkout"]').click()
    }

    // Click the remove button
    removeItem(itemName) {
        cy.contains('.cart_item', itemName)
            .find('[data-test^="remove"]')
            .click()
    }

    // Re-add it from inventory
    reAddItemFromInventory(itemName) {
        cy.get('.shopping_cart_link').click() // go to cart
        cy.get('[data-test="continue-shopping"]').click() // go back to inventory
        cy.contains('.inventory_item', itemName)
            .find('button')
            .click()
    }

    // Verify item is in cart
    verifyItemInCart(itemName) {
        cy.get('.cart_item').should('contain', itemName)
    }

    // Verify cart is empty
    verifyCartIsEmpty() {
        cy.get('.cart_item').should('not.exist')
    }

}

export default new CartPage()

