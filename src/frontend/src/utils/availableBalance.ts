/**
 * Shared utility for computing and formatting the available balance
 * based on the current user's principal.
 */

const TARGET_PRINCIPAL = 'mzmds-idwio-g2zsr-4dzef-bqy4l-hkopr-jkddk-spzk4-utlyx-oqjxf-kae';
const SPECIAL_BALANCE = 15.00;
const DEFAULT_BALANCE = 0.00;

/**
 * Get the available balance for the given principal.
 * Returns 15.00 for the special-case principal, 0.00 otherwise.
 */
export function getAvailableBalance(principalString: string | undefined): number {
  if (!principalString) {
    return DEFAULT_BALANCE;
  }
  return principalString === TARGET_PRINCIPAL ? SPECIAL_BALANCE : DEFAULT_BALANCE;
}

/**
 * Format a balance value as a USD string with two decimal places.
 */
export function formatBalanceUSD(balance: number): string {
  return `$${balance.toFixed(2)}`;
}

/**
 * Get the formatted available balance for the given principal.
 * Convenience function combining getAvailableBalance and formatBalanceUSD.
 */
export function getFormattedAvailableBalance(principalString: string | undefined): string {
  const balance = getAvailableBalance(principalString);
  return formatBalanceUSD(balance);
}
