import { ErrorCodes } from "@/types/error";
import { TransactionType } from "@/enums/transaction";

/**
 * Key formats
 * - page.label
 * - page.modal.label
 * - modals.modal.label
 **/
export default interface LocaleSchema {
  general: {
    ok: string;
    cancel: string;
    confirm: string;
    close: string;
    all: string;
  },
  transaction: {
    title: string;
    walletModal: {
      title: string;
      name: string;
      amount: string;
      color: string;
    };
    expenseModal: {
      title: string;
      amount: string;
      description: string;
      category: string;
    };
    incomeModal: {
      title: string;
      amount: string;
      description: string;
      category: string;
    };
    transferModal: {
      title: string;
      amount: string;
      description: string;
      category: string;
      destinationWallet: string;
    };
    removeWallet: string;
  };
  category: {
    title: string;
    modal: {
      title: string;
      name: string;
      color: string;
      type: string;
    };
    removeModal: string;
  };
  settings: {
    title: string;
    language: string;
  };

  enums: {
    transactionType: Record<TransactionType, string>;
  };

  errors: Partial<Record<ErrorCodes, string>>;
}
