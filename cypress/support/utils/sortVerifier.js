/**
 * Sort Verifier Utility
 * Provides robust verification methods for product sorting
 * 
 * WORLD CLASS APPROACH: Centralized sorting logic with business-focused assertions
 */

class SortVerifier {
  /**
   * Verify products are sorted by price in specified direction
   * @param {string} direction - 'ascending' or 'descending'
   */
  static verifyPriceSort(direction = 'ascending') {
    cy.get('[data-test="inventory-item-price"]').then(($prices) => {
      const prices = Array.from($prices).map(el => 
        parseFloat(el.textContent.replace('$', ''))
      );
      
      if (direction === 'ascending') {
        expect(prices[0]).to.be.lessThan(prices[prices.length - 1]);
        // Verify all prices are in ascending order
        for (let i = 1; i < prices.length; i++) {
          expect(prices[i]).to.be.at.least(prices[i - 1]);
        }
      } else {
        expect(prices[0]).to.be.greaterThan(prices[prices.length - 1]);
        // Verify all prices are in descending order
        for (let i = 1; i < prices.length; i++) {
          expect(prices[i]).to.be.at.most(prices[i - 1]);
        }
      }
    });
  }

  /**
   * Verify products are sorted alphabetically in specified direction
   * @param {string} direction - 'ascending' or 'descending'
   */
  static verifyNameSort(direction = 'ascending') {
    cy.get('[data-test="inventory-item-name"]').then(($names) => {
      const names = Array.from($names).map(el => el.textContent.trim());
      const sortedNames = [...names].sort();
      
      if (direction === 'ascending') {
        expect(names).to.deep.equal(sortedNames);
      } else {
        expect(names).to.deep.equal(sortedNames.reverse());
      }
    });
  }

  /**
   * Verify sort dropdown reflects the selected option
   * @param {string} expectedOption - The expected selected option text
   */
  static verifySortSelection(expectedOption) {
    cy.get('[data-test="active-option"]').should('contain', expectedOption);
  }
}

module.exports = SortVerifier;
