class LoginPage {
    /**
     * Logs in with provided credentials.
     * @param {string} username
     * @param {string} password
     */
    login(username, password) {
        cy.log(`Logging in as ${username}`)
        cy.visit('/')
        cy.get('[data-test="username"]').type(username)
        cy.get('[data-test="password"]').type(password)
        cy.get('[data-test="login-button"]').click()
    }

    // Verifies successful login by checking URL and page title.     
    verifyLoginSuccess() {
        cy.url().should('include', '/inventory')
        cy.get('.title').should('contain', 'Products')
    }

    // Verified the Login Page is visible, so we know user has been logged out
    verifyLoginScreenVisible() {
        cy.url().should('include', '/');
        cy.get('[data-test="username"]').should('be.visible');
    }

}

export default new LoginPage()