import { noSwallowedErrorContext } from "../src/rules";
import { RuleTester } from "@typescript-eslint/rule-tester";
import parser from "@typescript-eslint/parser";
import * as vitest from "vitest";

// https://github.com/typescript-eslint/typescript-eslint/issues/7275#issuecomment-1643242066
RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

// https://typescript-eslint.io/developers/custom-rules/#testing-typed-rules
const ruleTester = new RuleTester({
    languageOptions: {
        parser,
        parserOptions: {
            projectService: {
                allowDefaultProject: ["*.ts*"],
            },
            tsconfigRootDir: __dirname,
            ecmaVersion: 2024,
        },
    },
});

ruleTester.run("no-swallowed-error-context", noSwallowedErrorContext, {
    valid: [
        {
            code: `
                try {
                    throw new Error("Original error");
                } catch (error) {
                    throw new Error("Failed to perform error prone operations", {
                        cause: error,
                    });
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                try {
                    throw new Error("Original error");
                } catch (error) {
                    // No error cause specified
                    throw new Error("Failed to perform error prone operations");
                }
            `,
            errors: [{ messageId: "missing-cause" }],
        },
    ],
});
