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
    'array-bracket-spacing': [2, 'never'],
    'arrow-spacing': [2],
    'block-spacing': [2, 'always'],
    'brace-style': [2, '1tbs', {
      'allowSingleLine': true
    }],
    'comma-spacing': [2, {
      'before': false,
      'after': true
    }],
    'comma-style': [2, 'last'],
    'computed-property-spacing': [2, 'never'],
    'constructor-super': [2],
    'curly': [2, 'multi-line'],
    'eqeqeq': [2],
    'func-style': [2, 'declaration', {
      'allowArrowFunctions': true
    }],
    'generator-star-spacing': [2, 'after'],
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
    'key-spacing': [2, {
      'beforeColon': false,
      'afterColon': true
    }],
    'linebreak-style': [2, 'unix'],
    'new-cap': [2, {
      'capIsNew': false
    }],
    'new-parens': [2],
    'no-alert': [2],
    'no-array-constructor': [2],
    'no-caller': [2],
    'no-class-assign': [2],
    'no-console': [2],
    'no-const-assign': [2],
    'no-dupe-class-members': [2],
    'no-empty-pattern': [2],
    'no-eval': [2],
    'no-extend-native': [2],
    'no-extra-bind': [2],
    'no-extra-semi': [2],
    'no-fallthrough': [2],
    'no-floating-decimal': [2],
    'no-implied-eval': [2],
    'no-labels': [2],
    'no-lone-blocks': [2],
    'no-lonely-if': [2],
    'no-loop-func': [2],
    'no-multi-spaces': [2],
    'no-multiple-empty-lines': [2, {
      'max': 1,
      'maxEOF': 1
    }],
    'no-native-reassign': [2],
    'no-new': [2],
    'no-new-func': [2],
    'no-new-object': [2],
    'no-new-wrappers': [2],
    'no-octal': [2],
    'no-octal-escape': [2],
    'no-proto': [2],
    'no-return-assign': [2],
    'no-self-compare': [2],
    'no-sequences': [2],
    'no-shadow-restricted-names': [2],
    'no-spaced-func': [2],
    'no-this-before-super': [2],
    'no-throw-literal': [2],
    'no-trailing-spaces': [2],
    'no-unexpected-multiline': [2],
    'no-unneeded-ternary': [2],
    'no-unused-expressions': [2],
    'no-use-before-define': [2],
    'no-useless-call': [2],
    'no-useless-concat': [2],
    'no-void': [2],
    'no-with': [2],
    'one-var': [2, 'never'],
    'operator-assignment': [2, 'always'],
    'padded-blocks': [2, 'never'],
    'prefer-arrow-callback': [2],
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
    'semi': [2, 'never'],
    'space-before-blocks': [2, 'always'],
    'space-in-parens': [2, 'never'],
    'space-infix-ops': [2],
    'space-unary-ops': [2, {
      'words': true,
      'nonwords': false
    }],
    'wrap-iife': [2],
    'yoda': [2, 'never'],
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
