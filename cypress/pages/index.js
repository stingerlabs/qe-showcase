// Barrel for the page object layer. Pages own selectors, actions, and
// load-state guards; specs own orchestration and business assertions.
// Pages never import each other (only shared components), so there are no
// circular-require traps.
module.exports = {
  header: require("./components/header.component"),
  loginPage: require("./login.page"),
  inventoryPage: require("./inventory.page"),
  cartPage: require("./cart.page"),
  checkoutInfoPage: require("./checkout-info.page"),
  checkoutOverviewPage: require("./checkout-overview.page"),
  checkoutCompletePage: require("./checkout-complete.page"),
};
