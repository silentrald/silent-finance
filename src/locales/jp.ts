import LocaleSchema from "./types";

// Disclaimer: this only uses google translate
const jp: LocaleSchema = {
  general: {
    ok: "はい",
    cancel: "いいえ",
    confirm: "確認する",
    close: "近い",
  },
  transaction: {
    title: "取引",
    walletModal: {
      title: "ウォレットを追加",
      name: "名前",
      amount: "額",
      color: "色",
    },
    expenseModal: {
      title: "経費",
      amount: "額",
      description: "説明",
      category: "カテゴリ",
      wallet: "財布",
    },
  },
  category: {
    title: "カテゴリ",
    modal: {
      title: "カテゴリを追加",
      name: "名前",
      color: "色",
    },
  },
  settings: {
    title: "設定",
    language: "言語",
  },
};

export default jp;
