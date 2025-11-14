/**
 * Utility functions for formatting currency
 */

/**
 * Format number to Indonesian Rupiah format
 * @param amount - Amount in Rupiah
 * @returns Formatted string (e.g., "Rp 10.000")
 */
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format price range for products
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price (optional)
 * @returns Formatted price string
 */
export const formatProductPrice = (minPrice: number, maxPrice?: number): string => {
  if (maxPrice && maxPrice > minPrice) {
    return `${formatRupiah(minPrice)} - ${formatRupiah(maxPrice)}`;
  }
  return formatRupiah(minPrice);
};

/**
 * Format price range for events
 * @param ticketCategories - Array of ticket categories with prices
 * @returns Formatted price string
 */
export const formatEventPrice = (ticketCategories: Array<{ price: number; category: string }>): string => {
  if (!ticketCategories || ticketCategories.length === 0) {
    return 'Gratis';
  }

  const prices = ticketCategories.map(tc => tc.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (minPrice === 0 && maxPrice === 0) {
    return 'Gratis';
  }

  if (minPrice === maxPrice) {
    return formatRupiah(minPrice);
  }

  return `${formatRupiah(minPrice)} - ${formatRupiah(maxPrice)}`;
};