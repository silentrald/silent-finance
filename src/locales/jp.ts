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
    createTransaction: "トランザクションを作成する",
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
