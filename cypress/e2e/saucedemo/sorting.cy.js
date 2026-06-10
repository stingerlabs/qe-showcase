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
    cy.fixture("saucedemo/users").then(({ standard }) => cy.loginAs(standard));
    cy.getByDataTest("inventory-list").should("be.visible");
  });

  const sortCases = [
    {
      option: "az",
      describeAs: "Name (A to Z) sorts product names ascending",
      extractFrom: "inventory-item-name",
      toValues: textsOf,
      expectOrder: expectSortedAscending,
    },
    {
      option: "za",
      describeAs: "Name (Z to A) sorts product names descending",
      extractFrom: "inventory-item-name",
      toValues: textsOf,
      expectOrder: expectSortedDescending,
    },
    {
      option: "lohi",
      describeAs: "Price (low to high) sorts displayed prices ascending",
      extractFrom: "inventory-item-price",
      toValues: ($els) => textsOf($els).map(parseUsdToCents),
      expectOrder: expectSortedAscending,
    },
    {
      option: "hilo",
      describeAs: "Price (high to low) sorts displayed prices descending",
      extractFrom: "inventory-item-price",
      toValues: ($els) => textsOf($els).map(parseUsdToCents),
      expectOrder: expectSortedDescending,
    },
  ];

  sortCases.forEach(({ option, describeAs, extractFrom, toValues, expectOrder }) => {
    it(describeAs, () => {
      // Select and assert as separate queries — the app re-renders the select
      // on change, which would detach a chained subject.
      cy.getByDataTest("product-sort-container").select(option);
      cy.getByDataTest("product-sort-container").should("have.value", option);
      // .should(callback) retries until the re-sorted list settles, unlike .then.
      cy.getByDataTest(extractFrom).should(($els) => expectOrder(toValues($els)));
    });
  });
});
