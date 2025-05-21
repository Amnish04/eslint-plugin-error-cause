# eslint-plugin-error-cause

[![NPM Version](https://img.shields.io/npm/v/eslint-plugin-error-cause?color=dark)](https://www.npmjs.com/package/eslint-plugin-error-cause) ![NPM Downloads](https://img.shields.io/npm/dw/eslint-plugin-error-cause?color=green) ![GitHub License](https://img.shields.io/github/license/Amnish04/eslint-plugin-error-cause)

An ESLint plugin with rules to report loss of original [error cause](https://nodejs.org/api/errors.html#errorcaus), when rethrowing errors.

## Context

From [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)

> The cause data property of an Error instance indicates the specific original cause of the error.
>
> It is used when catching and re-throwing an error with a more-specific or useful error message in order to still have access to the original error.

This property was only added to Node in its `16.9.0` release, before which JavaScript developers used to rely on workarounds like including the `cause` error message in the `symptom` error message like so:

```ts
catch(error) {
    // NO LONGER NEEDED ❌
    throw new Error(`Failed to perform operation xyz: ${error.message}`);
}
```

The modern way to do this is by explicitly specifying the `cause` error in the `symptom` error constructor, essentially chaining the two errors which has been a common pattern in other languages like [Java](https://www.geeksforgeeks.org/chained-exceptions-java/).

```ts
catch(error) {
    throw new Error(`Failed to perform operation xyz`, {
        cause: error // The right way ✅
    });
}
```

## Installation

Install `eslint` and this plugin as dev dependencies.

```
pnpm add -D eslint eslint-plugin-error-cause
```

## Configuration (ESLint v8.23.0+ Flat Config)

From [v8.21.0](https://github.com/eslint/eslint/releases/tag/v8.21.0), eslint announced a new config system. In the new system, `.eslintrc*` is no longer used. `eslint.config.js` would be the default config file name. In eslint `v8`, the legacy system (.eslintrc\*) would still be supported, while in eslint `v9`, only the new system would be supported.

And from `v8.23.0`, eslint CLI starts to look up `eslint.config.js`. This plugin only supports the new config system, so if your eslint is `>=8.23.0`, you're 100% ready to use the new config system.

You could **either** use the preset `recommended` config exported from this project or enable the rule manually.

#### Recommended

This enables `no-swallowed-error-cause` rule with a `warn` severity level.

```ts
import errorCause from "eslint-plugin-error-cause";
import { defineConfig } from "eslint/config";

export default defineConfig([errorCause.configs.recommended]);
```

#### Manual Config

This is particularly useful if you want to set a different severity level than `warn`.

```ts
import errorCause from "eslint-plugin-error-cause";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        plugins: {
            "error-cause": errorCause,
        },
        rules: {
            "error-cause/no-swallowed-error-cause": "warn",
        },
    },
]);
```

## List of supported rules

<!-- begin auto-generated rules list -->

| Name                                                               | Description                                                           |
| :----------------------------------------------------------------- | :-------------------------------------------------------------------- |
| [no-swallowed-error-cause](docs/rules/no-swallowed-error-cause.md) | disallow losing original error `cause` when rethrowing custom errors. |

<!-- end auto-generated rules list -->

## License

`eslint-plugin-error-cause` is licensed under the [MIT License](https://opensource.org/license/mit).
