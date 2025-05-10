import { swallowedErrorContext } from "../src/rules";
import { RuleTester } from "eslint";

const ruleTester = new RuleTester();

ruleTester.run("swallowed-error-context", swallowedErrorContext, {
    valid: [
        {
            code: "var foo = true",
            options: [{ allowFoo: true }],
        },
    ],
    invalid: [
        {
            code: "var invalidVariable = true",
            errors: [{ message: "Unexpected invalid variable." }],
        },
        {
            code: "var invalidVariable = true",
            errors: [{ message: /^Unexpected.+variable/ }],
        },
    ],
});
