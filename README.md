[![Build Status](https://ci.microkube.com/api/badges/openware/baseapp/status.svg)](https://ci.microkube.com/openware/baseapp)

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

## Test

In `<rootDir>`

```bash
$ yarn test
```

For more options for `jest` run `yarn test --help`.

## Obfuscate

To prepare an obfuscated build, run:

```
docker build -t baseapp:obfuscated
  --build-arg BUILD_EXPIRE=1560761577000(unix epoch seconds)
  --build-arg BUILD_DOMAIN="example.com"
  -f Dockerfile-obfuscator .
```
where `BUILD_EXPIRE` is a Unix Timestamp of the build expiration date in seconds,
​            `BUILD_DOMAIN` is the domain which you'd like to use during the deployment

The resulting image would be accessible by the `baseapp:obfuscated` tag.
