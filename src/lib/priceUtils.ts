/**
 * Format number as INR currency
 * @param amount - Amount in INR
 * @returns Formatted string (e.g., "₹3,750.00")
 */
export const formatInr = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '₹0.00';
  return `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format number as INR currency without decimals
 * @param amount - Amount in INR
 * @returns Formatted string (e.g., "₹3,750")
 */
export const formatInrNoDecimals = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '₹0';
  return `₹${numAmount.toLocaleString('en-IN')}`;
};

