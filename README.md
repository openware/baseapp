[![Build Status](https://ci.microkube.com/api/badges/openware/baseapp/status.svg)](https://ci.microkube.com/openware/baseapp)

Base Crypto Application
---

## Add an npm auth token for install components library

```bash
$ echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" > .npmrc
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
You can find all the available build args in the `available Docker build args` section

The resulting image would be accessible by the `baseapp:obfuscated` tag.

## Available Docker build args

While building a Docker image you can pass build-dependant arguments using `--build-arg`: 
`docker build -t baseapp:latest
  --build-arg BUILD_DOMAIN="example.com" .`

| Argument                 | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `BUILD_EXPIRE`               |  Unix Timestamp of the build expiration date in seconds |
| `BUILD_DOMAIN`               |  Domain which you'd like to use during the deployment |
| `NPM_AUTH_TOKEN` |  The authentication token of npmjs.com used to fetch private packages |

## env.js configuration explanation

In `public/config` open `env.js`


| Argument                 | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `api`    | URLs of `barong`, `peatio`, `applogic` and `ranger` API endpoints. You can use mockserver (<https://github.com/openware/mockserver>) with default `env.js` values |
| `minutesUntilAutoLogout`                |  Autologout time in minutes  |
| `withCredentials`               |  `false` or `true` if you want to include cookies as part of the request(https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)   |
| `captcha - captchaType`         |  `'recaptcha'`, `'geetest'` or `'none'`   |
| `captcha - siteKey`         |  Recaptha site key   |
| `gaTrackerKey` |  Google Analytics tracker key  |
| `rangerReconnectPeriod` |  Reconnection time for the Ranger WS service in minutes    |
| `msAlertDisplayTime` |  Alert message display duration in milliseconds    |
