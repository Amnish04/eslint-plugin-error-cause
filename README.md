# eslint-plugin-error-context
An ESLint plugin with rules to report loss of original [error cause](https://nodejs.org/api/errors.html#errorcaus), when rethrowing errors.

From [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)
> The cause data property of an Error instance indicates the specific original cause of the error.
>
> It is used when catching and re-throwing an error with a more-specific or useful error message in order to still have access to the original error.

This property was only added to Node in its `16.9.0` release, before which JavaScript developers used to rely on workarounds like including the `cause` error message in the `symptom` error message like so:
```ts
catch(error) {
    throw new Error(`Failed to perform operation xyz: ${error.message}`); // NO LONGER NEEDED ❌
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


