export class StringUtils {
  /**
   * Normalize a string
   * @param {string} s - input string
   * @returns {string} - Normal readable string
   */
  static normalize(s) {
    return s.replace(/\s+/g, " ").trim();
  }
}
