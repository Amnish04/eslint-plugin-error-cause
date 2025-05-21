# Disallow losing original error `cause` when re-throwing custom errors (`error-cause/no-swallowed-error-cause`)

<!-- end auto-generated rule header -->

This rule reports an error of configured severity level, for any instances in code where re-throwing custom specific errors leads to loss of original error context.

**Incorrect:**

```ts
try {
    // ...
} catch (error) {
    throw new Error("Something went wrong: " + error.message);
}
```

**Correct:**

```ts
try {
    // ...
} catch (error) {
    throw new Error("Something went wrong", { cause: error });
}
```
