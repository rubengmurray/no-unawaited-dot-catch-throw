# no-unawaited-dot-catch-throw

### Description

An ESLint rule to highlight when throw statements are used inside unawaited `.catch()` blocks.

### Installation

`npm i eslint-plugin-no-unawaited-dot-catch-throw -D`

Add this to your ESLint config file

```json
  "plugins": [
    "no-unawaited-dot-catch-throw"
  ],
  "rules": {
      "no-unawaited-dot-catch-throw/enforce-no-unawaited-dot-catch-throw": "error"
  }
```

### Rule Details

A `throw ;` statement inside an unawaited .catch() statement has no effect on the runtime of the program. This rule aims to highlight when this is done.

## Rule Details

Examples of **incorrect** code for this rule:

::: incorrect

```js
/* eslint no-useless-return: "error" */

const myAsyncFunction = async () => { 
  // some asynchronous task
};

// Function isn't awaited, a re-throw will not terminate code-flow
myAsyncFunction().catch((error) => {
  console.error(error);
  throw error;
});

```

:::

Examples of **correct** code for this rule:

::: correct

```js
/* eslint no-useless-return: "error" */

const myAsyncFunction = async () => { 
  // some asynchronous task
};

// Catch does not re-throw
myAsyncFunction().catch((error) => {
  console.error(error);
});

// Function is awaited, a re-throw will still terminate code-flow
await myAsyncFunction().catch((error) => {
  console.error(error);
  throw error;
});

```

:::

## When Not To Use It

If you don't care about disallowing throw statements that doesn't affect execution flow, you can turn off this rule.
