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
      addWallet: string;
      name: string;
      amount: string;
      color: string;
    };
  };
  category: {
    title: string;
    modal: {
      addCategory: string;
      name: string;
      color: string;
    };
  };
  settings: {
    title: string;
    language: string;
  };
}
