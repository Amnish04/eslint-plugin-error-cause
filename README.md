<h1 align="center">eslint-plugin-error-cause</h1>

<div align="center">
    <a href="https://www.npmjs.com/package/eslint-plugin-error-cause">
        <img src="https://img.shields.io/npm/v/eslint-plugin-error-cause?color=dark" alt="NPM Version">
    </a>
    <a href="https://github.com/Amnish04/eslint-plugin-error-cause/actions">
        <img src="https://img.shields.io/github/actions/workflow/status/Amnish04/eslint-plugin-error-cause/ci.yml" alt="GitHub Actions Workflow Status">
    </a>
    <a href="https://www.npmjs.com/package/eslint-plugin-error-cause">
        <img src="https://img.shields.io/npm/dw/eslint-plugin-error-cause?color=blue" alt="NPM Downloads">
    </a>
    <a href="https://github.com/Amnish04/eslint-plugin-error-cause/blob/main/LICENSE">
        <img src="https://img.shields.io/github/license/Amnish04/eslint-plugin-error-cause?color=red" alt="GitHub License">
    </a>
</div>

<p align="center">
    An ESLint plugin with rules to report loss of original <a href="https://nodejs.org/api/errors.html#error_cause">error cause</a>, when re-throwing errors.
</p>

![code-art](https://github.com/user-attachments/assets/d4a68b8d-897b-4df9-a605-f24850d5759d)

<hr/>

## Table of Contents

- [Background](#background)
- [Installation](#installation)
- [Configuration](#configuration-eslint-v8230-flat-config)
- [List of supported rules](#list-of-supported-rules)
- [Contributing](#contributing)
- [References](#references)
- [License](#license)

## Background

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

```bash
pnpm add -D eslint eslint-plugin-error-cause
```

## Configuration (ESLint v8.23.0+ Flat Config)

From [v8.21.0](https://github.com/eslint/eslint/releases/tag/v8.21.0), eslint announced a new config system. In the new system, `.eslintrc*` is no longer used. `eslint.config.js` would be the default config file name. In eslint `v8`, the legacy system (.eslintrc\*) would still be supported, while in eslint `v9`, only the new system would be supported.

And from `v8.23.0`, eslint CLI starts to look up `eslint.config.js`. This plugin only supports the new config system, so if your eslint is `>=8.23.0`, you're 100% ready to use the new config system.

You could **either** use the preset `recommended` config exported from this project or enable the rule manually.

### Recommended

This enables `no-swallowed-error-cause` rule with a `warn` severity level.

```ts
import errorCause from "eslint-plugin-error-cause";
import { defineConfig } from "eslint/config";

export default defineConfig([errorCause.configs.recommended]);
```

### Manual Config

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

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                               | Description                                                            | 🔧 |
| :----------------------------------------------------------------- | :--------------------------------------------------------------------- | :- |
| [no-swallowed-error-cause](docs/rules/no-swallowed-error-cause.md) | disallow losing original error `cause` when re-throwing custom errors. | 🔧 |

<!-- end auto-generated rules list -->

## Contributing

Got an idea for a new rule, or found a bug that needs to be fixed?

Its time to [file an issue](https://github.com/Amnish04/eslint-plugin-error-cause/issues)!

Make sure to read [CONTRIBUTING.md](https://github.com/Amnish04/eslint-plugin-error-cause/blob/amnish04/contrubuting.md/CONTRIBUTING.md) for more details.

## References

- [typescript-eslint playground](https://typescript-eslint.io/play/#ts=5.8.2&fileType=.tsx&code=LAKCA&eslintrc=N4KABGBEBOCuA2BTAzpAXGYBfEWg&tsconfig=N4KABGBEDGD2C2AHAlgGwKYCcDyiAuysAdgM6QBcYoEEkJemy0eAcgK6qoDCAFutAGsylBm3TgwAXxCSgA&tokens=false) helps visualize JS and TS ASTs and aid development when writing rules.
- [eslint-plugin-exception-handling](https://github.com/Akronae/eslint-plugin-exception-handling) is a wider scoped exception handling plugin.

## License

`eslint-plugin-error-cause` is licensed under the [MIT License](https://opensource.org/license/mit).
