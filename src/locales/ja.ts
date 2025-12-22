import LocaleSchema from "./types";

// Disclaimer: this only uses google translate
const jp: LocaleSchema = {
  general: {
    ok: "はい",
    cancel: "いいえ",
    confirm: "確認する",
    close: "近い",
    all: "全て",
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
    },
    incomeModal: {
      title: "所得",
      amount: "額",
      description: "説明",
      category: "カテゴリ",
    },
    transferModal: {
      title: "移行",
      amount: "額",
      description: "説明",
      category: "カテゴリ",
      destinationWallet: "デスティネーションウォレット",
    },
  },
  category: {
    title: "カテゴリ",
    modal: {
      title: "カテゴリを追加",
      name: "名前",
      color: "色",
      type: "タイプ",
    },
  },
  settings: {
    title: "設定",
    language: "言語",
  },

  enums: {
    transactionType: {
      E: "経費",
      I: "所得",
      T: "移行",
    },
  },

  errors: {
    REPO_NOT_FOUND: "{table} にレコードが見つかりませんでした。キー {fields}",

    NO_DESTINATION_WALLET: "転送先のウォレットが見つかりませんでした。",
  },
};

export default jp;
