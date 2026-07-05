const user = {
  username: "standard_user",
  password: "secret_sauce",
};

const checkoutInfo = {
  firstName: "Jonas",
  lastName: "Poulsen",
  postalCode: "9000",
};

const getByTest = (testId) => cy.get(`[data-test="${testId}"]`);

const loginAs = (username, password) => {
  getByTest("username").type(username);
  getByTest("password").type(password);
  getByTest("login-button").click();
};

const parsePrice = (priceText) => Number(priceText.replace("$", ""));

describe("SauceDemo purchase flow", () => {
  it("sorts products by rendered price and completes checkout with the selected item", () => {
    cy.visit("/");
    loginAs(user.username, user.password);
    getByTest("title").should("have.text", "Products");

    getByTest("product-sort-container").select("lohi");

    cy.get('[data-test="inventory-item-price"]').should(($prices) => {
      const renderedPrices = [...$prices].map((price) => parsePrice(price.innerText));
      const sortedPrices = [...renderedPrices].sort((a, b) => a - b);

      expect(renderedPrices, "rendered prices are sorted low to high").to.deep.equal(sortedPrices);
    });

    cy.get('[data-test="inventory-item"]').first().within(() => {
      getByTest("inventory-item-name").invoke("text").as("selectedName");
      getByTest("inventory-item-price").invoke("text").as("selectedPrice");
      cy.get('button[data-test^="add-to-cart"]').click();
    });

    getByTest("shopping-cart-badge").should("have.text", "1");
    getByTest("shopping-cart-link").click();

    cy.get("@selectedName").then((selectedName) => {
      cy.get("@selectedPrice").then((selectedPrice) => {
        cy.get('[data-test="inventory-item"]').should("have.length", 1).first().within(() => {
          getByTest("inventory-item-name").should("have.text", selectedName);
          getByTest("inventory-item-price").should("have.text", selectedPrice);
          getByTest("item-quantity").should("have.text", "1");
        });

        getByTest("checkout").click();
        getByTest("firstName").type(checkoutInfo.firstName);
        getByTest("lastName").type(checkoutInfo.lastName);
        getByTest("postalCode").type(checkoutInfo.postalCode);
        getByTest("continue").click();

        cy.get('[data-test="inventory-item"]').should("have.length", 1).first().within(() => {
          getByTest("inventory-item-name").should("have.text", selectedName);
          getByTest("inventory-item-price").should("have.text", selectedPrice);
          getByTest("item-quantity").should("have.text", "1");
        });

        getByTest("finish").click();
        getByTest("complete-header").should("have.text", "Thank you for your order!");
      });
    });
  });

  it("shows the expected error for a locked out user", () => {
    cy.visit("/");
    loginAs("locked_out_user", user.password);

    getByTest("error").should("have.text", "Epic sadface: Sorry, this user has been locked out.");
    cy.location("pathname").should("not.eq", "/inventory.html");
  });
});
