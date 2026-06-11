const { loginPage, inventoryPage } = require("../../pages");
const {
  parseUsdToCents,
  textsOf,
  expectSortedAscending,
  expectSortedDescending,
} = require("../../support/helpers");

// All four sort options, each verified against the rendered result. Selecting
// an option proves nothing by itself — every case extracts the displayed
// names/prices and asserts the actual order. Data-driven so adding a sort
// option later is a one-line change.
describe("SauceDemo product sorting", () => {
  beforeEach(() => {
    cy.fixture("saucedemo/users").then(({ standard }) => loginPage.loginAs(standard));
    inventoryPage.assertLoaded();
  });

  const sortCases = [
    {
      option: "az",
      describeAs: "Name (A to Z) sorts product names ascending",
      elements: () => inventoryPage.itemNames(),
      toValues: textsOf,
      expectOrder: expectSortedAscending,
    },
    {
      option: "za",
      describeAs: "Name (Z to A) sorts product names descending",
      elements: () => inventoryPage.itemNames(),
      toValues: textsOf,
      expectOrder: expectSortedDescending,
    },
    {
      option: "lohi",
      describeAs: "Price (low to high) sorts displayed prices ascending",
      elements: () => inventoryPage.itemPrices(),
      toValues: ($els) => textsOf($els).map(parseUsdToCents),
      expectOrder: expectSortedAscending,
    },
    {
      option: "hilo",
      describeAs: "Price (high to low) sorts displayed prices descending",
      elements: () => inventoryPage.itemPrices(),
      toValues: ($els) => textsOf($els).map(parseUsdToCents),
      expectOrder: expectSortedDescending,
    },
  ];

  sortCases.forEach(({ option, describeAs, elements, toValues, expectOrder }) => {
    it(describeAs, () => {
      inventoryPage.sortBy(option);
      // .should(callback) retries until the re-sorted list settles, unlike .then.
      elements().should(($els) => expectOrder(toValues($els)));
    });
  });
});
