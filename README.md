# Earthstar Fuzz Testing

This code does property-based testing of [Earthstar](https://github.com/earthstar-project/earthstar/) using the [fast-check](https://github.com/dubzzz/fast-check) library.

## To run it

```sh
yarn install
yarn test
```

## How to add more tests

Use [Jest](https://jestjs.io/docs/expect) assertions.

Fast-check generates data such as strings and arrays using ["Arbitraries"](https://github.com/dubzzz/fast-check/blob/main/documentation/Arbitraries.md).

For making more complex data, consider generating it with [json-schema-fast-check](https://github.com/meeshkan/json-schema-fast-check) or [zod-fast-check](https://github.com/DavidTimms/zod-fast-check).

`fc.assert` options are described in the [Runners](https://github.com/dubzzz/fast-check/blob/main/documentation/Runners.md#runners) documentation.
