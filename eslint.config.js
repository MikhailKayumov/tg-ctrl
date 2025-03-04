/* eslint-disable @typescript-eslint/no-require-imports */
const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import-x');
const eslintConfigPrettier = require('eslint-plugin-prettier/recommended');
const globals = require('globals');
const { config, configs } = require('typescript-eslint');

module.exports = config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [
      js.configs.recommended,
      ...configs.recommended,
      eslintConfigPrettier,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    files: ['**/*.{ts,tsx,js,jsx,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.nodeBuiltin,
    },
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      '@typescript-eslint/no-explicit-any': 1,
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          caughtErrors: 'none',
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unused-expressions': [2, { allowShortCircuit: true, allowTernary: true }],
      // 'import-x/no-unresolved': [2, { ignore: ['^@/'] }],
      // 'import-x/default': 0,
      'import-x/order': [
        'warn',
        {
          pathGroups: [{ pattern: '@/**', group: 'external', position: 'after' }],
          groups: ['builtin', 'external', 'internal', 'type', 'object', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            orderImportKind: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
);
