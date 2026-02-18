/**
 * Shared utility for formatting balance values as USD.
 */

/**
 * Format a balance value as a USD string with two decimal places.
 */
export function formatBalanceUSD(balance: number): string {
  return `$${balance.toFixed(2)}`;
}
