export default interface LocaleSchema {
  general: {
    ok: string;
    cancel: string;
  },
  transaction: {
    title: string;
    createTransaction: string;
  };
  category: {
    title: string;
    createCategory: string;
  };
  settings: {
    title: string;
    language: string;
  };
}
