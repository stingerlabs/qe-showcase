const js = require('@eslint/js');
const cypress = require('eslint-plugin-cypress');

module.exports = [
  js.configs.recommended,
  {
    files: ['cypress/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Cypress globals
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        before: 'readonly',
        after: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        // Node.js globals
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      cypress,
    },
    rules: {
      // Cypress-specific rules
      'cypress/no-assigning-return-values': 'error',
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/assertion-before-screenshot': 'warn',
      'cypress/no-force': 'warn',
      
      // General code quality rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      
      // Code style rules - relaxed for Cypress
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': 'off', // Allow both semicolon styles
      'comma-dangle': 'off', // Allow both comma styles
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      
      // Best practices
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
    },
  },
];
