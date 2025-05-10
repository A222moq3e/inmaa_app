module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
  rules: {
    // Add special rule overrides here
    'react/react-in-jsx-scope': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    'react/no-unescaped-entities': 'error',
  },
}; 