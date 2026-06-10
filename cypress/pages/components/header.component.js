// The app header (cart icon + badge) is rendered on every authenticated page,
// so it's modelled once as a component rather than duplicated on each page
// object.
class HeaderComponent {
  /** Cart badge element. Query it with `should("not.exist")` to assert an empty cart. */
  cartBadge() {
    return cy.getByDataTest("shopping-cart-badge");
  }

  openCart() {
    cy.getByDataTest("shopping-cart-link").click();
  }
}

module.exports = new HeaderComponent();
