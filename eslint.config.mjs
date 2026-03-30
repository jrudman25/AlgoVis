import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

const eslintConfig = defineConfig([
    globalIgnores([
        'out/**',
        'build/**',
        'coverage/**',

        // Development environment & cache ignores
        '.tanstack/**',
        '.idea/**',
        '.vscode/**',
        'node_modules/**',
        'dist/**',

        // Config file ignores
        '*.config.js',
        '*.config.mjs',
        '*.config.ts',

        // Auto-generated files
        'src/routeTree.gen.ts',

        '**/*.md',
        '**/*.json'
    ]),

    // TypeScript parser for .ts/.tsx files
    {
        files: ['**/*.{ts,tsx}'],
        extends: [tseslint.configs.recommended],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            // React rules
            "react/no-deprecated": "error",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        }
    },

    // Custom Rules for Best Practices
    {
        rules: {

            // Errors
            "for-direction": "error",
            "no-redeclare": "error",
            "no-cond-assign": "error",
            "no-const-assign": "error",
            "no-dupe-else-if": "error",
            "no-invalid-regexp": "error",
            "no-loss-of-precision": "error",
            "no-self-assign": "error",
            "no-self-compare": "error",
            "no-unmodified-loop-condition": "error",
            "no-unreachable-loop": "error",
            "no-unreachable": "error",
            "no-use-before-define": "error",

            // Warns
            "no-duplicate-imports": "warn",
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_"
            }],
            "no-fallthrough": "warn",
            "no-lonely-if": "warn",
            "no-empty": "warn",
            "curly": ["warn", "all"],
            "prefer-const": "warn",
            "no-useless-concat": "warn",
            "no-useless-escape": "warn",
            "no-useless-return": "warn",
            "no-useless-rename": "warn",
            "no-return-assign": "warn",
        }
    }
])

export default eslintConfig