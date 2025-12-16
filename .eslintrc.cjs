module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/no-deprecated-slot-attribute": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "sort-imports": "error",
    "comma-dangle": [ "error", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "never",
        "functions": "never",
    } ],
    "array-bracket-spacing": [ "error", "always" ],
    "object-curly-spacing": [ "error", "always" ],
    quotes: [ "error", "double" ],
    "no-trailing-spaces": "error",
  },
};
