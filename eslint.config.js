// ESLint flat config (ESLint >= 9).
export default [
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        // Browser globals commonly used inside the admin HTML script string
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
        Request: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off'
    }
  }
]
