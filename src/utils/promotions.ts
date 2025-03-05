/**
 * Converts a bank name to a bank ID format
 * @param bankName The name of the bank
 * @returns Lowercase bank name with spaces replaced by underscores
 */
export const getBankId = (bankName: string): string => {
  return bankName.toLowerCase().replace(/\s+/g, '_');
};

/**
 * Gets promotions by bank name
 * @param bankName The name of the bank
 * @param promotions Array of all promotions
 * @returns Filtered array of promotions for the specified bank
 */
export const getPromotionsByBank = (bankName: string, promotions: any[]) => {
  const bankId = getBankId(bankName);
  return promotions.filter(promo => promo.bank_id === bankId);
};

/**
 * Extracts unique bank names from an array of cards
 * @param cards Array of card objects
 * @returns Array of unique bank names
 */
export const getAvailableBanksFromCards = (cards: any[]) => {
  return Array.from(new Set(cards.map(card => card.bank)));
}; 