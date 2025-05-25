import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import parser from "@typescript-eslint/parser";

// https://typescript-eslint.io/developers/custom-rules/#testing-typed-rules
RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

export const getRuleTester = () => {
    return new RuleTester({
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
};
