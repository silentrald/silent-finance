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
      wallet: "Wallet",
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
};

export default en;
