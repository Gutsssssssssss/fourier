import js from '@eslint/js';
import fp from 'eslint-plugin-fp';

const fpRules = {
  'fp/no-let': 'error',
  'fp/no-mutating-methods': 'error',
  'fp/no-mutation': 'error',
  'fp/no-delete': 'error',
  'fp/no-loops': 'warn',
};

export default [
  js.configs.recommended,

  {
    files: ['src/lib/**/*.js', 'src/utils/**/*.js'],
    plugins: { fp },
    rules: fpRules,
  },
];
