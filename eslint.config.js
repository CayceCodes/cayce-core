import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import typescript from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
    eslint.configs.recommended,
    {
        ignores: ['**/dist/**/*.+(js|ts)', '**/node_modules/**/*.+(js|ts)'],
    },
    {
        files: ['src/*.ts'],
        languageOptions: {
            parser: typescript,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            },
            globals: {
                console: 'readonly',
                expect: 'readonly',
                it: 'readonly',
                jest: 'readonly',
                test: 'readonly',
                beforeEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                afterEach: 'readonly',
            }
        },
        plugins: {
            '@typescript-eslint': tseslint
        },
        rules: {
            ...tseslint.configs.recommended.rules
        }
    },
    {
        files: ['**/__tests__/**/*.ts'],
        languageOptions: {
            globals: {
                describe: 'readonly',
                expect: 'readonly',
                it: 'readonly',
                jest: 'readonly',
                test: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                console: 'readonly'
            }
        }
    },
    prettier
];