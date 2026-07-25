// @ts-check

import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      globals: {
        window: 'readonly',
        parent: 'readonly',
        document: 'readonly',
        console: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        toastr: 'readonly',
        getVariables: 'readonly',
        insertOrAssignVariables: 'readonly',
        getCurrentCharacterName: 'readonly',
        getCharWorldbookNames: 'readonly',
        generateRaw: 'readonly',
        getModelList: 'readonly',
        stopGenerationById: 'readonly',
        getWorldbook: 'readonly',
        createWorldbookEntries: 'readonly',
        updateWorldbookWith: 'readonly',
      },
    },
    rules: {
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-console': 'off',
      'prefer-const': 'warn',
    },
    ignores: ['dist/**', 'node_modules/**', '@types/**', 'old/**'],
  },
);