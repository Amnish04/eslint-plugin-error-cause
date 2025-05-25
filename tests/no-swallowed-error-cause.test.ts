import { noSwallowedErrorCause } from "../src/rules/no-swallowed-error-cause";
import { getRuleTester } from "./rule-tester";

const ruleTester = getRuleTester();

ruleTester.run("no-swallowed-error-cause", noSwallowedErrorCause, {
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
            output: `
            try {
            doSomething();
            } catch (err) {
            throw new Error("Something failed", { cause: err });
            }
            `,
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
            output: `
            try {
            doSomething();
            } catch (err) {
            const unrelated = new Error("other");
            throw new Error("Something failed", { cause: err });
            }
            `,
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
            output: `
                try {
                doSomething();
                } catch (error) {
                throw new Error("Failed", { cause: error });
                }
            `,
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
            output: `
                try {
                doSomething();
                } catch (error) {
                throw new Error("Failed", { cause: error });
                }
            `,
        },
        // 5. Throws a new Error, cause property is present but value is a different identifier
        // TODO: We need to start allowing this behavior as it is not actually invalid.
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
            output: `
                try {
                doSomething();
                } catch (err) {
                const e = err;
                throw new Error("Failed", { cause: err });
                }
            `,
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
            output: `
                try {
                doSomething();
                } catch (error) {
                throw new Error("Failed", { cause: error });
                }
            `,
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
            output: `
                try {
                doSomething();
                } catch (error) {
                throw new Error("Failed", { cause: error });
                }
            `,
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
            output: `
                try {
                doSomething();
                } catch (error) {
                throw new Error("Failed", { cause: error });
                }
            `,
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
            output: `
              try {
                doSomething();
              } catch (error) {
                if (shouldThrow) {
                  while (true) {
                    if (Math.random() > 0.5) {
                      throw new Error("Failed without cause", { cause: error });
                    }
                  }
                }
              }
            `,
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
            output: `
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
        // Throw statement with a template literal error message
        {
            code: `
                try {
                    doSomething();
                } catch (error) {
                    throw new Error(\`The certificate key "\${chalk.yellow(keyFile)}" is invalid.\n\${err.message}\`);
                }
            `,
            errors: [{ messageId: "missing-cause" }],
            output: `
                try {
                    doSomething();
                } catch (error) {
                    throw new Error(\`The certificate key "\${chalk.yellow(keyFile)}" is invalid.\n\${err.message}\`, { cause: error });
                }
            `,
        },
        // Throw statement with a variable error message
        {
            code: `
                try {
                    doSomething();
                } catch (error) {
                    const errorMessage = "Operation failed";
                    throw new Error(errorMessage);
                }
            `,
            errors: [{ messageId: "missing-cause" }],
            output: `
                try {
                    doSomething();
                } catch (error) {
                    const errorMessage = "Operation failed";
                    throw new Error(errorMessage, { cause: error });
                }
            `,
        },
    ],
});
