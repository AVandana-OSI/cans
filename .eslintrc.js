module.exports = {
  extends: [
    'standard',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:jasmine/recommended',
    'prettier',
    'prettier/react',
    'prettier/standard',
  ],
  plugins: ['react', 'jsx-a11y', 'jest', 'prettier', 'standard', 'jasmine'],
  env: {
    browser: true,
    es6: true,
    jasmine: true,
    node: true,
    'jest/globals': true,
  },
  rules: {
    'prettier/prettier': 'error',
    'jsx-a11y/label-has-for': [
      'error',
      {
        components: ['label'],
        required: {
          some: ['nesting', 'id'],
        },
        allowChildren: true,
      },
    ],
    'jasmine/new-line-before-expect': 0,
    'jasmine/new-line-between-declarations': 2,
    'jasmine/no-spec-dupes': [2, 'branch'],
    'jasmine/no-suite-dupes': [2, 'branch'],
    'react/no-unused-state': 2,
    'react/boolean-prop-naming': [
      2,
      {
        rule: '^(is|has|can)[A-Z]([A-Za-z0-9]?)+',
        message: `The prop ({{ propName }}) needs to start with 'is' or 'has'`,
      },
    ],
    'react/no-multi-comp': 2,
    'react/no-typos': 2,
    'react/no-unused-prop-types': 2,
    'react/prefer-es6-class': [2, 'always'],
    'react/prefer-stateless-function': [2, { ignorePureComponents: true }],
    'react/require-default-props': [2, { forbidDefaultForRequired: true }],
    'react/self-closing-comp': [
      2,
      {
        component: true,
        html: true,
      },
    ],
    'react/sort-prop-types': 2,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
      modules: true,
    },
    sourceType: 'module',
  },
};
