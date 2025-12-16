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
      addWallet: "ウォレットを追加",
      name: "名前",
      amount: "額",
      color: "色",
    },
  },
  category: {
    title: "カテゴリ",
    modal: {
      addCategory: "カテゴリを追加",
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
