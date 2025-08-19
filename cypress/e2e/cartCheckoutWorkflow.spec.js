import { users } from '../fixtures/users'
import login from '../pages/loginPage'
import inventory from '../pages/inventoryPage'
import cart from '../pages/cartPage'
import checkout from '../pages/checkoutPage'

describe('Cart and Checkout Workflow', () => {
    const user = users.standard

    it('logs in, adds item, cancels checkout, and completes order', () => {
        const itemName = 'Sauce Labs Backpack'

        // Login and verify it's successful
        login.login(user.username, user.password)
        login.verifyLoginSuccess()

        // Go to Inventory and sort
        inventory.verifyInventoryPageLoaded()
        inventory.sortBy('Price (low to high)')
        inventory.verifyItemAtPosition(5, itemName)
        inventory.addItemToCartByName(itemName)

        // Add and remove item from Cart
        cart.goToCart()
        cart.verifyItemInCart(itemName)
        cart.removeItem(itemName)
        cart.verifyCartIsEmpty()
        cart.reAddItemFromInventory(itemName)
        cart.goToCart()
        cart.verifyItemInCart(itemName)

        // Checkout (cancel flow)
        cart.startCheckout()
        checkout.verifyFormFieldsVisible()
        checkout.fillInfo('Jason', 'Parsons', '54321')
        checkout.cancel()
        cart.goToCart()
        checkout.verifyBackOnCartPage()

        // Checkout (complete flow)
        cart.startCheckout()
        checkout.verifyStepOnePage()
        checkout.verifyFormFieldsVisible()
        checkout.fillInfo('Jason', 'Parsons', '54321')
        checkout.clickContinue()
        checkout.verifyStepTwoPage('Sauce Labs Backpack', '$29.99')
        checkout.finish()
        checkout.verifyCompletePage()
        checkout.verifyConfirmationVisible()
        checkout.verifyConfirmation('your order has been dispatched')
        inventory.clickBackToHome();
    })

    afterEach(() => {
        // Logout and verify login screen
        cy.logout();
    });

})

