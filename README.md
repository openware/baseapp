[![Build Status](https://ci.microkube.com/api/badges/openware/baseapp/status.svg)](https://ci.microkube.com/openware/baseapp)

Base Crypto Application
---

## Add an npm auth token for install components library

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
You can find all the available build args in the `available Docker build args` section

The resulting image would be accessible by the `baseapp:obfuscated` tag.

## Working with Enterprise version

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

## Enterprise Docker image build

To prepare an enterprise build, run:

```bash
docker build -t baseapp:enterprise 
  --build-arg REACT_APP_BUILD_VERSION="Enterprise" .
```

The resulting image would be accessible by the `baseapp:enterprise` tag.

## Available Docker build args

While building a Docker image you can pass build-dependant arguments using `--build-arg`: 
`docker build -t baseapp:latest
  --build-arg BUILD_DOMAIN="example.com" .`

| Argument                 | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `REACT_APP_BUILD_VERSION`                  | Use `Enterprise` to get a full-fledged baseapp build or `Lite` to build a limited trial version |
| `BUILD_EXPIRE`               |  Unix Timestamp of the build expiration date in seconds |
| `BUILD_DOMAIN`               |  Domain which you'd like to use during the deployment |
| `REACT_APP_TENKO_PUBLIC_KEY` |  Tenko public key used only for Lite version builds | 
| `NPM_AUTH_TOKEN` |  The authentication token of npmjs.com used to fetch private packages |

## env.js configuration explanation

In `public/config` open `env.js`


| Argument                 | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `api`    | URLs of `barong`, `peatio`, `applogic`, `ranger` and `tenko` API endpoints. You can use mockserver (<https://github.com/openware/mockserver>) with default `env.js` values |
| `minutesUntilAutoLogout`                |  Autologout time in minutes  |
| `withCredentials`               |  `false` or `true` if you want to include cookies as part of the request(https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)   |
| `captcha - captchaType`         |  `'recaptcha'`, `'geetest'` or `'none'`   |
| `captcha - siteKey`         |  Recaptha site key   |
| `gaTrackerKey` |  Google Analytics tracker key  |
| `rangerReconnectPeriod` |  Reconnection time for the Ranger WS service in minutes    |
| `msAlertDisplayTime` |  Alert message display duration in milliseconds    |
| `licenseKey` |  Openware license key which can be generated at <https://openware.com/licenses>   |
