import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
// import prettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {},
    rules: {
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
