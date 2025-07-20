// Reusable login page
class LoginPage 
{
    // Navigates to the SauceDemo login page
    goto(url) {
        cy.visit(url);
    }
  // Login details come from data file, passed from Test
    login(username, password) 
    {
        cy.get('#user-name').type(username)
        cy.get('#password').type(password)
        cy.get('#login-button').click()
        cy.url().should('include','/inventory')
    }
}

export default LoginPage
