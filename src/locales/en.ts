import LocaleSchema from "./types";

const en: LocaleSchema = {
  general: {
    ok: "Ok",
    cancel: "Cancel",
    confirm: "Confirm",
    close: "Close",
  },
  transaction: {
    title: "Transactions",
    walletModal: {
      title: "Add Wallet",
      name: "Name",
      amount: "Amount",
      color: "Color",
    },
    expenseModal: {
      title: "Expense",
      amount: "Amount",
      description: "Description",
      category: "Category",
    },
    incomeModal: {
      title: "Income",
      amount: "Amount",
      description: "Description",
      category: "Category",
    },
    transferModal: {
      title: "Transfer",
      amount: "Amount",
      description: "Description",
      category: "Category",
      destinationWallet: "Destination Wallet",
    },
  },
  category: {
    title: "Categories",
    modal: {
      title: "Add Category",
      name: "Name",
      color: "Color",
    },
  },
  settings: {
    title: "Settings",
    language: "Language",
  },

  errors: {
    REPO_NOT_FOUND: "Could not find record in {table}. Keys {fields}",

    NO_DESTINATION_WALLET: "Could not find any wallet to transfer to.",
  },
};

export default en;
