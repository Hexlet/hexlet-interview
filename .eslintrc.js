module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb-base'],
  root: true,
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint',
      ],
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/test/**/*.ts'] }],
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'error',
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        'no-underscore-dangle': ['error', { allow: ['__'] }],
        'import/no-cycle': 'off',
        'prettier/prettier': 'error',
        'no-non-null-assertion': 0,
        'max-len': ['error', { code: 120 }],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
      env: {
        node: true,
        jest: true,
      },
      plugins: ['prettier'],
    },
    {
      files: ['**/migrations/**/*.ts'],
      rules: {
        '@typescript-eslint/class-name-casing': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: ['./test/**/*.ts'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['*.js'],
      env: {
        browser: true,
        jquery: true
      },
    },
  ],
};
