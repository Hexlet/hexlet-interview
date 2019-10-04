module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  plugins: [
    'prettier',
  ],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {devDependencies: ['**/test/**/*.ts']},

    ],
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': ['error', {'allow': ['__']}],
    'import/no-cycle': 'off',
    'prettier/prettier': 'error'
  },
  'overrides': [{
    'files': ['**/migrations/**/*.ts'],
    'rules': {
      '@typescript-eslint/class-name-casing': 'off',
    }
  }]
};
