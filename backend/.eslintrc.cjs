module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2021,
        sourceTyp: "module",
    },
    extends: [
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    plugins: ["@typescript-eslint", "prettier"],
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "prettier/prettier": "error",
    },
};
