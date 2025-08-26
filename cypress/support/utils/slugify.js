/**
 * slugify Utility 
 * Converts product names into URL-friendly selectors for dynamic HTML elements
 * 
 * Problem we are facing: HTML uses dynamic selectors like 'add-to-cart-sauce-labs-backpack'
 * Solution: Centralized utility for consistent, reliable selector generation
 * Value: Eliminates maintenance overhead and prevents selector failures
 */

/**
 * Converts product name to URL-friendly selector
 * Examples: "Sauce Labs Backpack" → "sauce-labs-backpack"
 */
module.exports = function slugify(name) {
  return name.toLowerCase()
             .replace(/\s+/g, '-')        // Spaces to hyphens
             .replace(/[().']/g, '')      // Remove special chars
             .replace(/-+/g, '-');        // Clean multiple hyphens
};
