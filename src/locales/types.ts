
// page.label
// page.modal.label
// If modal is used by other pages
// modals.modal.label
export default interface LocaleSchema {
  general: {
    ok: string;
    cancel: string;
    confirm: string;
    close: string;
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
      wallet: string;
    };
  };
  category: {
    title: string;
    modal: {
      title: string;
      name: string;
      color: string;
    };
  };
  settings: {
    title: string;
    language: string;
  };
}
