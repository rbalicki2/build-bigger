module.exports = {
  root: true,
  extends: [
    'airbnb',
    'plugin:flowtype/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:react/recommended',
  ],
  env: {
    browser: true,
  },
  parser: 'babel-eslint',
  rules: {
    'operator-linebreak': [2, 'before'],
    'react/jsx-no-bind': 0,
    'react/prefer-stateless-function': 2,
    'func-style': [2, 'expression'],
    'no-use-before-define': 0,
    'no-unused-vars': [2, { ignoreRestSiblings: true }],
    'max-len': [2, {
      code: 100,
      tabWidth: 2,
      ignorePattern: '^import',
      ignoreUrls: true,
    }],
    'no-mixed-operators': [2, { allowSamePrecedence: true }],
    'react/no-direct-mutation-state': 2,
    'no-multiple-empty-lines': ['error', { maxEOF: 1, maxBOF: 0, max: 1 }],
    'eol-last': 'error',
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    'react/require-default-props': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/accessible-emoji': 0,
    'react/forbid-prop-types': 0,
    'no-plusplus': 0,
    'jsx-a11y/alt-text': 0,

    // plugin react has some nitpicky rules
    'react/display-name': 0,
    'react/no-unused-state': 2,
    'react/no-unused-prop-types': 2,
    'react/no-did-mount-set-state': 0,

    'react/no-multi-comp': 0,
    'react/prop-types': 0,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.babel.js',
      },
    },
    flowtype: {
      onlyFilesWithFlowAnnotation: false,
    },
  },
  plugins: [
    'babel',
    'react',
    'import',
    'flowtype',
  ],
};
