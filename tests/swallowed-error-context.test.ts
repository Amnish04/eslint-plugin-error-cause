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
        {
            code: `
                try {
                doSomething();
                } catch (e) {
                // No throw, should be valid
                console.error(e);
                }
            `,
        },
        {
            code: `
                try {
                doSomething();
                } catch {
                // No catch param, should be valid
                throw new Error("Failed");
                }
            `,
        },
        {
            code: `
                try {
                doSomething();
                } catch (err) {
                throw new Error("Failed", { cause: err, extra: 42 });
                }
            `,
        },
        // Complex construct with `SwitchStatement`
        {
            code: `
              try {
                doSomething();
              } catch (error) {
                switch (error.code) {
                  case "A":
                    throw new Error("Type A", { cause: error });
                  case "B":
                    throw new Error("Type B", { cause: error });
                  default:
                    throw new Error("Other", { cause: error });
                }
              }
            `,
        },
    ],
    invalid: [
        // 1. Throws a new Error without cause, even though an error was caught
        {
            code: `
            try {
            doSomething();
            } catch (err) {
            throw new Error("Something failed");
            }
            `,
            errors: [{ messageId: "missing-cause" }],
        },
        // 2. Throws a new Error with unrelated cause
        {
            code: `
            try {
            doSomething();
            } catch (err) {
            const unrelated = new Error("other");
            throw new Error("Something failed", { cause: unrelated });
            }
            `,
            errors: [{ messageId: "missing-cause" }],
        },
        // 3. Throws a new Error with cause property, but value is not the caught error
        {
            code: `
                try {
                doSomething();
                } catch (error) {
                throw new Error("Failed", { cause: "notTheError" });
                }
            `,
            errors: [{ messageId: "missing-cause" }],
        },
        // 4. Throws a new Error, cause property is present but misspelled
        {
            code: `
                try {
                doSomething();
                } catch (error) {
                throw new Error("Failed", { cuse: error });
                }
            `,
            errors: [{ messageId: "missing-cause" }],
        },
        // 5. Throws a new Error, cause property is present but value is a different identifier
        {
            code: `
                try {
                doSomething();
                } catch (err) {
                const e = err;
                throw new Error("Failed", { cause: e });
                }
            `,
            errors: [{ messageId: "missing-cause" }],
        },
        // 6. Throws a new Error, cause property is present but value is a member expression
        {
            code: `
                try {
                doSomething();
                } catch (error) {
                throw new Error("Failed", { cause: error.message });
                }
            `,
            errors: [{ messageId: "missing-cause" }],
        },
        // 7. Throws a new Error, cause property is present but value is a literal
        {
            code: `
                try {
                doSomething();
                } catch (error) {
                throw new Error("Failed", { cause: 123 });
                }
            `,
            errors: [{ messageId: "missing-cause" }],
        },
        // 8. Throws a new Error, cause property is present but value is a function call
        {
            code: `
                try {
                doSomething();
                } catch (error) {
                throw new Error("Failed", { cause: getError() });
                }
            `,
            errors: [{ messageId: "missing-cause" }],
        },
        // 9. throw in a heavily nested catch block
        {
            code: `
              try {
                doSomething();
              } catch (error) {
                if (shouldThrow) {
                  while (true) {
                    if (Math.random() > 0.5) {
                      throw new Error("Failed without cause");
                    }
                  }
                }
              }
            `,
            errors: [{ messageId: "missing-cause" }],
        },
        // 10. construct with a `switch` statement
        {
            code: `
              try {
                doSomething();
              } catch (error) {
                switch (error.code) {
                  case "A":
                    throw new Error("Type A");
                  case "B":
                    throw new Error("Type B", { cause: error });
                  default:
                    throw new Error("Other", { cause: error });
                }
              }
            `,
            errors: [{ messageId: "missing-cause" }],
        },
    ],
});
