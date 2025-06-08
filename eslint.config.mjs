import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'off', // 追加: any型の警告を無視
      // 他のルールを追加
    },
  },
  globalIgnores([
    'node_module/**',
    'src/api/**',
    'src/app/api/**',
    'src/assets/**',
    '.next/**',
    'out/**',
    'coverage/**',
    'dist/**',
    'public/**',
    'build/**',
    'lib/**',
  ]),
];

export default eslintConfig;
