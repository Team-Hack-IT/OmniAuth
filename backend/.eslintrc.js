module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    extends: [
      'plugin:@typescript-eslint/recommended',
      'prettier',
      'prettier/@typescript-eslint',
    ],
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
      'prettier/prettier': 'error',
    },
  };