/**
 * Format a number using Indian numbering system (en-IN).
 * @param {number} num - The number to format.
 * @returns {string} Formatted number string.
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-IN').format(num);
}
