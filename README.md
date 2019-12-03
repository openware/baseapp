Base react application to build a trading platform application
---

## Install dependencies

```bash
$ yarn install
```

## Run in developement mode

```bash
$ yarn start
```

## Execute tests

In `<rootDir>`

```bash
$ yarn test
```

For more options for `jest` run `yarn test --help`.

## Available Docker build args

While building a Docker image you can pass build-dependant arguments using `--build-arg`: 
`docker build -t baseapp:latest
  --build-arg BUILD_DOMAIN="example.com" .`

| Argument                 | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `BUILD_EXPIRE`               |  Unix Timestamp of the build expiration date in seconds |
| `BUILD_DOMAIN`               |  Domain which you'd like to use during the deployment |

## env.js configuration documentation

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
