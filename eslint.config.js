import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
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
]);
