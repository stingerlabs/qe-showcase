// Pure helper functions shared by specs. Plain functions (not Cypress
// commands) so they can be unit-reasoned and used inside .then() callbacks.

/**
 * Parse a USD amount out of a string and return integer cents.
 * Works for raw prices ("$49.99") and labelled totals ("Item total: $49.99").
 * Integer cents avoid float arithmetic surprises (0.1 + 0.2 !== 0.3) when
 * asserting subtotal + tax === total.
 * Throws on unparseable input so a layout change fails loudly instead of
 * silently comparing NaN (NaN comparisons would still fail, but with a
 * far less useful message).
 */
function parseUsdToCents(text) {
  const match = /\$(\d+)\.(\d{2})/.exec(text);
  if (!match) {
    throw new Error(`Expected a USD amount like "$12.34" in: "${text}"`);
  }
  return Number(match[1]) * 100 + Number(match[2]);
}

/** Trimmed visible text of each element in a jQuery collection. */
function textsOf($elements) {
  return [...$elements].map((el) => el.innerText.trim());
}

/**
 * Assert values are sorted ascending (numbers numerically, strings
 * lexicographically — matching how the app itself sorts its plain-ASCII
 * product names).
 */
function expectSortedAscending(values) {
  expect(values, "at least two values to compare").to.have.length.greaterThan(1);
  const sorted = [...values].sort(compare);
  expect(values).to.deep.equal(sorted);
}

/** Assert values are sorted descending. */
function expectSortedDescending(values) {
  expect(values, "at least two values to compare").to.have.length.greaterThan(1);
  const sorted = [...values].sort((a, b) => compare(b, a));
  expect(values).to.deep.equal(sorted);
}

function compare(a, b) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return a < b ? -1 : a > b ? 1 : 0;
}

module.exports = {
  parseUsdToCents,
  textsOf,
  expectSortedAscending,
  expectSortedDescending,
};
