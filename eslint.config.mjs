// js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import nodePlugin from "eslint-plugin-n";
import parser from "@typescript-eslint/parser";

export default defineConfig([
    // 1. Ignore build and dependency output everywhere
    {
        ignores: ["dist/", "node_modules/"],
    },
    // 2. TypeScript source files
    {
        files: ["src/**/*.{js,mjs,cjs,ts}"],
        languageOptions: {
            parser,
            ecmaVersion: 2024,
            globals: globals.browser,
        },
        plugins: {
            js,
            "eslint-plugin": eslintPlugin,
            "n": nodePlugin,
        },
        extends: [
            "js/recommended",
            // node plugin's recommended config for scripts
            nodePlugin.configs["flat/recommended-script"],
            // typescript-eslint recommended
            ...tseslint.configs.recommended,
            // eslint-plugin-eslint-plugin recommended
            eslintPlugin.configs["flat/recommended"],
        ],
        rules: {
            // Custom rules and overrides
            "eslint-plugin/require-meta-docs-description": "error",
            "n/exports-style": ["error", "module.exports"],
            "n/no-missing-import": "off",
            "n/no-unpublished-import": "off",
        },
    },
]);
