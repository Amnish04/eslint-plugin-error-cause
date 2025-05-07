import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import nodePlugin from "eslint-plugin-n";

// This config follows suggestions from official ESLint custom plugin docs
// https://eslint.org/docs/latest/extend/plugins#linting-a-plugin
export default defineConfig([
    // @eslint/js
    { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
    // eslint-plugin-eslint-plugin
    eslintPlugin.configs["flat/recommended"],
    {
        rules: {
            "eslint-plugin/require-meta-docs-description": "error",
        },
    },
    // eslint-plugin-n
    nodePlugin.configs["flat/recommended-script"],
    {
        rules: {
            "n/exports-style": ["error", "module.exports"],
            "n/no-missing-import": "off",
            "n/no-unpublished-import": "off",
        },
    },
    { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
    tseslint.configs.recommended,
]);
