import { noSwallowedErrorContext } from "../src/rules";
import { RuleTester } from "@typescript-eslint/rule-tester";
import parser from "@typescript-eslint/parser";

const ruleTester = new RuleTester({
    languageOptions: {
        parser,
        parserOptions: {
            projectService: {
                allowDefaultProject: ["*.ts*"],
            },
            tsconfigRootDir: __dirname,
        },
    },
});

ruleTester.run("no-swallowed-error-context", noSwallowedErrorContext, {
    valid: [
        {
            code: "var foo = true",
        },
    ],
    invalid: [
        {
            code: "var invalidVariable = true",
            errors: [{ messageId: "missing-cause" }],
        },
        {
            code: "var invalidVariable = false",
            errors: [{ messageId: "missing-cause" }],
        },
    ],
});
