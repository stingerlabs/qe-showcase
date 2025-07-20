class ProductsPage 
{
   addProductToCart(productDisplayName) 
    { // Supplied product name is converted by replacing spaces with hypen(-) so we are able to use it to build locator
        const productSelectorName = productDisplayName.toLowerCase().replace(/\s+/g, '-');
        cy.get(`#add-to-cart-${productSelectorName}`).click();
        cy.get(`#remove-${productSelectorName}`).should('exist');  //checking if product is added to Cart
    }

    navigateToCart() 
    // Clicking cart page link and also checking url changes
    {
        cy.get('.shopping_cart_link').should('be.visible').and('not.be.disabled').click()
        cy.url().should('include', '/cart.html')
    }

    validateProductsSortedByPriceAsc()  
    {
    // Get all product prices before applying the filter, so we can compare after filter changes later.
        cy.get('.inventory_item_price').then($prices => 
            {
                const beforePrices = [...$prices].map(price => 
                parseFloat(price.innerText.replace('$', ''))
                )
            
            cy.log('Before Prices: ' + JSON.stringify(beforePrices))  // printing current prices array to log for comparision
            })

        // Apply the filter
        cy.get('[data-test="product-sort-container"]').select('Price (low to high)')

        // Get all product prices after sort and compare if products are reordered as per filter
        cy.get('.inventory_item_price').then($prices => 
            {
                const priceValues = [...$prices].map(price => 
                parseFloat(price.innerText.replace('$', ''))
                )
                
                // Check if prices are sorted in ascending order
                const sortedPrices = [...priceValues].sort((a, b) => a - b)
                cy.log('Sorted Prices: ' + JSON.stringify(sortedPrices))  // Log the sorted prices for debugging

                expect(priceValues).to.deep.equal(sortedPrices)
                
            })
}
}
export default ProductsPage