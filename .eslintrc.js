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
  plugins: ['react', 'jsx-a11y', 'jest', 'prettier', 'standard', 'jasmine', 'babel'],
  env: {
    browser: true,
    es6: true,
    jasmine: true,
    node: true,
    'jest/globals': true,
  },
  rules: {
    'array-bracket-spacing': [2, 'never'],
    'babel/no-invalid-this': 1,
    'consistent-return': [2],
    'computed-property-spacing': [2, 'never'],
    'dot-notation': [2],
    'func-names': [2],
    'func-style': [2, 'declaration', {
      'allowArrowFunctions': true
    }],
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
    'linebreak-style': [2, 'unix'],
    'no-alert': [2],
    'no-console': [2],
    'no-extra-semi': [2],
    'no-implicit-coercion': [2],
    'no-lonely-if': [2],
    'no-loop-func': [2],
    //This following rule will be turned to error in future once all warnigns are taken care in tech debt
    'no-magic-numbers': [1, {ignore: [-1,0,1,2]}],
    'no-native-reassign': [2],
    'no-spaced-func': [2],
    'no-useless-concat': [2],
    'no-var': [2],
    'no-void': [2],
    'operator-assignment': [2, 'always'],
    'prefer-arrow-callback': [2],
    'prefer-const': [2],
    'prefer-spread': [2],
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        trailingComma: 'es5',
        singleQuote: true,
        semi: false,
      }
    ],
    'prefer-template': [2],
    'radix': [2, 'as-needed'],
    'react/boolean-prop-naming': [
      2,
      {
        rule: '^(is|has|can)[A-Z]([A-Za-z0-9]?)+',
        message: `The prop ({{ propName }}) needs to start with 'is' or 'has'`,
      },
    ],
    'react/jsx-closing-bracket-location': [2, 'tag-aligned'],
    'react/jsx-curly-spacing': [2, 'never'],
    'react/jsx-indent-props': [2, 2],
    'react/no-danger': [2],
    'react/no-did-mount-set-state': [1],
    'react/no-did-update-set-state': [1],
    'react/no-unused-state': 2,
    'react/no-multi-comp': 2,
    'react/no-typos': 2,
    'react/no-unused-prop-types': 2,
    'react/prefer-es6-class': [2, 'always'],
    'react/prefer-stateless-function': [2, {
      ignorePureComponents: true
    }],
    'react/require-default-props': [2, {
      forbidDefaultForRequired: true
    }],
    'react/self-closing-comp': [
      2,
      {
        component: true,
        html: true,
      },
    ],
    'react/sort-prop-types': [2],
    'react/sort-comp': [2],
    'require-yield': [2],
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
