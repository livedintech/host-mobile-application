import i18next from 'i18next';

/**
 * Formats currency based on the current language
 * @param value The numerical price
 * @returns Formatted string (e.g., "SAR 100" or "١٠٠ ر.س")
 */
export const FormatCurrency = (value: number | string) => {
  const amount = Number(value) || 0;
  const isAr = i18next.language === 'ar';

  if (isAr) {
    // Standard Arabic currency format
    return `${amount} ر.س`; 
    // If you want Arabic numerals as well, use:
    // return amount.toLocaleString('ar-SA') + ' ر.س';
  }

  return `SAR ${amount}`;
};