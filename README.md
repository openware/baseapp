CryptoBase Base Application
---

## Add npm token for install components library

```bash
$ echo "//registry.npmjs.org/:_authToken=199fa5c9-8c7c-4cc2-b4c4-78524fdcab41" > ~/.npmrc
```

## Install

```bash
$ yarn install
$ yarn build
```

## Run

In `<rootDir>`

```bash  
$ yarn start
```

### Testing

In `<rootDir>`

```bash
$ yarn test
```

For more options for `jest` run `yarn test --help`.
