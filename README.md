[![Build Status](https://ci.microkube.com/api/badges/openware/baseapp/status.svg)](https://ci.microkube.com/openware/baseapp)

Base Crypto Application
---

## Add npm token for install components library

```bash
$ echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" > .npmrc
```

## Export Tenko public key

```bash
export REACT_APP_TENKO_PUBLIC_KEY=LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUE3SlduK3dFRVZwaThEcWdVRmR5ZwpHTk5Hd3pOSzcycGVLWFBDWEtKVDg0WjZMcVpKRHMrN0d4bmZrcUZYNENyR3NvTFgzOWt2ZXBOUktiK2ttYzl6ClFuYjc0SXRJcDIzc3I4c252Nk5ERGplVjJtRjgvSDh3b3ByUk5vdEMvY3dRcGtsdFd0dzRGWFFuU00ySGdlNTkKcmdoa1k1TmVRVUJmSUt3UEt6YlNlSHpyak5GQjhDcXpobWlxN2NET1B4UnNydHorQTI1M2FTSFd0REkxNm5WbgoySXRjcHdtOStZbnFoYVRLMWNMYjZlcjdmRlhFWVhDa3ZUT0Vna2Q4cFhabXBpMkpoK2VhdVQ3blVKZ3ZnUXZOCkI0T0dSZWtqMjllZThpclZwdG5waEZ3KzF4L0dEQThSWWRmQUo5TUgzWkE1UXNCVjhtSGxibDJ1U1NzZTJZVmUKMndJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==
```￼

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

## Working on Enterprise version

1. Link the Enterprise containers

```bash
  cd src/containers/
  unlink index.ts
  ln -s indexEnterprise.ts index.ts
```

2. Run the application with the correct environment
```bash
REACT_APP_BUILD_VERSION=Enterprise yarn start
```
