module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
  },
  plugins: [
    //
    '@typescript-eslint',
  ],
  extends: [
    //
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'no-async-promise-executor': 'error',
    'require-atomic-updates': 'error',
    'array-callback-return': 'error',
  },
}
