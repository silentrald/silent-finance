
/**
 * Used for WalletDenomination and TransactionDenomination to simplify the
 *   representation of the denomination amount and count.
 **/
export interface AmountCount {
  id: number; // Denomination Id
  amount: number;
  count: number;
}
