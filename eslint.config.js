import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import typescript from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.strictTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
            ...tseslint.configs.recommendedTypeChecked,
            prettier,
        ],
    },
    {
        ignores: ['**/dist/**/*.+(js|ts)', '**/node_modules/**/*.+(js|ts)', 'eslint.config.js', 'jest.config.js'],
    },
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: typescript,
            parserOptions: {
                ecmaVersion: 'latest',
                projectService: true,
                projectServiceOptions: {
                    defaultProject: true,
                },
                project: './tsconfig.json',
                sourceType: 'module',
                tsconfigRootDir: import.meta.dirname,
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
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
        },
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
                console: 'readonly',
            },
        },
    }
);
