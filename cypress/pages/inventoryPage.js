class InventoryPage {
    // Sort items by visible text (e.g., "Price (low to high)")
    sortBy(optionText) {
        cy.get('[data-test="product-sort-container"]').select(optionText)
    }

    // Add item to cart by name — using your original method name
    addItemToCartByName(itemName) {
        cy.contains('.inventory_item', itemName)
            .find('button')
            .click()
    }

    // Verify item name at a specific position (1-based index)
    verifyItemAtPosition(position, itemName) {
        cy.get('.inventory_item_name')
            .eq(position - 1)
            .should('contain', itemName)
    }

    // Verify Inventory Page Loaded
    verifyInventoryPageLoaded() {
        cy.url().should('include', '/inventory.html')
        cy.get('.inventory_list').should('be.visible')
    }

    // Click back to home to bring user to Inventory Page
    clickBackToHome() {
        cy.get('[data-test="back-to-products"]').click();
    }

}

export default new InventoryPage()


