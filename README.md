# OpenDAX BaseApp UI
## FREE Open-Source UI for Trading and Wallets Management

Base React application to build a trading platform interface for use with OpenDAX: https://github.com/openware/opendax
Why React? Well - it's fresh, fast, flexible, and you can do a lot of UI magic with it without reloading the pages.

You can see an example of a live application running at: https://demo.openware.com/

## Add an npm auth token for install components library

```bash
$ echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" > .npmrc
```

## Install dependencies

```bash
$ yarn install
$ yarn build
```

## Run in developement mode

In `<rootDir>`

```bash
$ yarn start
```

## Execute test

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

## Available Docker build args

While building a Docker image you can pass build-dependant arguments using `--build-arg`: 
`docker build -t baseapp:latest
  --build-arg BUILD_DOMAIN="example.com" .`

| Argument       | Description                                            |
| -------------- | ------------------------------------------------------ |
| `BUILD_EXPIRE` | Unix Timestamp of the build expiration date in seconds |
| `BUILD_DOMAIN` | Domain which you'd like to use during the deployment   |

## Happy trading with OpenDAX BaseApp UI

If you have designed something beautiful with it, we would love to see it!

And if you have any comments, feedback and suggestions - we are happy to hear from you here at GitHub or at https://openware.com

