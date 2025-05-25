# Contributing to eslint-plugin-error-cause

Thank you for considering contributing to `eslint-plugin-error-cause`! This document outlines the guidelines and steps to contribute to the project.

## Table of Contents

- [Contributing to eslint-plugin-error-cause](#contributing-to-eslint-plugin-error-cause)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#preqrequisites)
  - [Development Setup](#development-setup)
  - [Submitting Changes](#submitting-changes)
  - [Testing](#testing)
  - [Issue and Pull Request Guidelines](#issue-and-pull-request-guidelines)
  - [License](#license)

## Prerequisites

To get started with contributing to ChatCraft.org, please make sure you have the following:

- [pnpm](https://pnpm.io) package manager installed globally
- [Node.js](https://nodejs.org) installed (via pnpm) on your machine

## Development Setup

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Navigate to the project's root directory.
4. Install the project dependencies by running the following command:

```bash
pnpm install
```

## Testing

This project uses [@typescript-eslint/rule-tester](https://typescript-eslint.io/packages/rule-tester/) and [vitest](https://vitest.dev/) for the [RuleTester](https://eslint.org/docs/latest/integrate/nodejs-api#ruletester) utility and the test runner.

1. If you're making **fixes** to existing rules or adding a **new rule**, please add corresponding test cases to `/tests/<rule-name>.test.ts` file. See [tests/no-swallowed-error-cause.test.ts](https://github.com/Amnish04/eslint-plugin-error-cause/blob/main/tests/no-swallowed-error-cause.test.ts) for reference.
2. The best way to test your changes is by executing the tests as you make progress. This helps keep the dev loop tighter and reports important details with assertions.
```bash
pnpm test
```

## Submitting Changes

When you're ready to submit your changes, please follow these steps:

1. If you have added any new rules or made changes to documentation properties of existing rules, regenerate the rule documentation with the following command. We use [eslint-doc-generator](https://github.com/bmish/eslint-doc-generator)
for this.

```bash
pnpm update:eslint-docs
```
2. Make sure you manually update any relevant documentation that is not part of automatic generation.
3. Commit your changes to your local repository.
4. Push your changes to your forked repository on GitHub.
5. Open a pull request against the main repository.

## Issue and Pull Request Guidelines

When creating an issue or pull request, please provide as much detail as possible. This includes a clear description of the problem or proposed change, steps to reproduce (if applicable), and any relevant code or screenshots.

## License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](https://opensource.org/licenses/MIT).
