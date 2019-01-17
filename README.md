CryptoBase React Components
---

[![CircleCI](https://circleci.com/gh/openware/cryptobase.svg?style=svg&circle-token=f97e0e5fb6d1200dd0ee9e1a3879772b1c0cade6)](https://circleci.com/gh/openware/cryptobase)

## Install

```bash
$ npm -g install lerna
$ yarn bootstrap
$ yarn build
```

## Run components

In `<rootDir>`

```bash  
$ yarn bootstrap
$ yarn build
$ cd packages/components
$ yarn start
```

## Run playground

In `<rootDir>`

```bash  
$ yarn bootstrap
$ yarn build
$ cd packages/playground
$ yarn start
```

### Testing

In `<rootDir>`

```bash
$ yarn test
```

For more options for `jest` run `yarn test --help`.

### Building Individual Package

For instance, to build demo `payground` application:

```bash
$ cd packages/playground
$ yarn bootstrap
$ yarn build
```

### Adding Packages

For instance, to add `webpack-cli` to `@openware/crypto-font`, run in root or anywhere:

```bash
$ lerna add --scrope=@openware/crypto-font [--dev] webpack-cli
```

Or, add packages to corresponding `package.json` and run `yarn bootstrap` again.

Caveats:
- To add a packaged to all you repos, skip `--scope` option;
- It is impossible with `lerna` to add multiple packages from a command line at
  once. Each needs to be added separately.


### Working with Individual Packages

Treat everything under `packages` as normal package. The only requirements are:

  - your package must be scoped in `@openware`: i.e. `@openware/my-wonderful-utility`
  - `devDependencies` must have:
    - `typescript`
    - `tslint`
    - `@openware/coding-standards`

### Circle CI

You can use (Circle CI Cli)[https://circleci.com/docs/2.0/local-cli/]
to run CI builds locally on your machine.

Make sure you have (Docker)[https://www.docker.com/] and
(circleci)[https://circleci.com/docs/2.0/local-cli/] installed, then run:
I.e.

```
$ circleci build --job build
```

Circle CI configuration is in `.circleci` folder of this repository.

### If in Doubt

Run `yarn bootstrap`. If it's still not working for you, rise an issue in [#cryptobase-react](https://rubykube.slack.com/messages/CB8KP7XMX).
