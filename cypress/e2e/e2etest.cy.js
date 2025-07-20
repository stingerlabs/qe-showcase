// Importing Page Objects
import LoginPage from "../support/pageObjects/loginPage.cy"
import ProductsPage from "../support/pageObjects/products.cy"
import Cart from "../support/pageObjects/cart.cy"
import Checkout from "../support/pageObjects/checkout.cy"
import CheckoutConfirmation from "../support/pageObjects/checkoutOverview.cy"
import Complete from "../support/pageObjects/complete.cy"
// Importing data from Fixtures
import e2eTestdata from '../fixtures/e2eTestdata.json'  

// This ia e2e checkout flow from login. Built on Page Object Model, Inputs like login details, Product name and checkout details come from e2eTestdata.json file in fixtures. 
// There are 6 Page object files which are called from this script.

describe('E2E test1', () => 
{
    // This is the E2E test case for checkout flow.
    it('e2e checkout flow', () => 
    {
        const loginPage = new LoginPage()
        loginPage.goto('https://www.saucedemo.com/')  //Passing the application url which can be further improved
        loginPage.login(e2eTestdata.username, e2eTestdata.password)    // Username and password from data file

        const productsPage = new ProductsPage()
        //Sorting products by price in ascending order and validating the sorted order
        productsPage.validateProductsSortedByPriceAsc()  

        // Adding a product to the cart
        productsPage.addProductToCart(e2eTestdata.productName)
        productsPage.navigateToCart()

        // verifying cart page
        const cart = new Cart()
        cart.verifyCart(e2eTestdata.productName, 1)
        cart.checkout()

        // checking out, checkout details come from data file.
        const checkout = new Checkout()
        checkout.fillInformation(e2eTestdata.Fname, e2eTestdata.Lname, e2eTestdata.postalcode)

        // Order review page
        const checkoutConfirmation = new CheckoutConfirmation()
        checkoutConfirmation.verifyOverview()
        checkoutConfirmation.clickfinish()

        // Success page
        const complete = new Complete()
        complete.verifyComplete()
    })
})
