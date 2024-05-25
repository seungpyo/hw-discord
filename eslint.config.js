// const blankLineBeforeReturn = require('./eslint-rules/blank-line-before-return.js');

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      '**/node_modules/**',
      'android/**',
      'ios/**',
      '.expo/**',
      'eslint.config.js',
    ],
    languageOptions: {
      globals: {
        es6: true,
        node: true,
      },
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      hooks: require('eslint-plugin-hooks'),
      prettier: require('eslint-plugin-prettier'),
      'simple-import-sort': require('eslint-plugin-simple-import-sort'),
      'unused-imports': require('eslint-plugin-unused-imports'),
      import: require('eslint-plugin-import'),
      // local: {
      //   rules: {
      //     'blank-line-before-return': blankLineBeforeReturn,
      //   },
      // },
    },
    rules: {
      eqeqeq: 'warn',
      'hooks/sort': [
        'error',
        {
          groups: [
            'useReducer',
            'useContext',
            'useAuth',
            'useChat',
            'useFonts',
            'useHeaderHeight',
            'useKeyboardController',
            'useKeyboardHeight',
            'useLLM',
            'useLocale',
            'useSafeAreaInsets',
            'useTheme',
            'useRealm',
            'useQuery',
            'useWindowDimensions',
            'useState',
            'useRef',
            'useDispatch',
            'useCallback',
            'useEffect',
          ],
        },
      ],
      'import/extensions': 'off',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'linebreak-style': 'off',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-debugger': 'off',
      'no-extra-semi': 'error',
      'no-nested-ternary': 'off',
      'no-shadow': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: true,
          classes: true,
          variables: false,
          allowNamedExports: false,
        },
      ],
      'no-var': 'warn',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: ['arrow-function', 'function-declaration'],
        },
      ],
      'react/jsx-filename-extension': [
        'error',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
      'react/jsx-key': 'warn',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-pascal-case': 'warn',
      'react/jsx-props-no-spreading': [
        'warn',
        {
          custom: 'ignore',
        },
      ],
      'react/prefer-stateless-function': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              '^react(?!.*\\u0000$)',
              '^\\w(?!.*\\u0000$)',
              '^@?(?!.*\\u0000$)',
              '^\\u0000',
              '^react',
              '^\\w',
              '^@?',
            ],
            [
              '^(assets|components|contexts|hooks|lib|models|navigation|screens|styles|translation|types|utils)(?!types)(?!.*\\u0000$)',
              '^(assets|components|contexts|hooks|lib|models|navigation|screens|styles|translation|types|utils)',
            ],
            [
              '^\\.\\../(?!.*\\u0000$)',
              '^\\./(?!.*\\u0000$)',
              '^\\.\\../',
              '^\\./',
            ],
            ['^'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      // 'local/blank-line-before-return': 'error',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  }
];