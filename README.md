# OpenDAX BaseApp UI
## User Interface for Trading and Wallets Management

Base React application to build a trading platform interface for use with OpenDAX: https://github.com/openware/opendax
Why React? We consider it's the biggest frontend community and have capacities to work in mobile native.

You can see an example of a live application running at: https://demo.openware.com/

## License

Please note, that BaseApp license only allows Non-Commercial use of this component. To purchase the Commercial license, please contact us at hello@openware.com.


## Install dependencies

```bash
$ yarn install
```

## Run in developement mode

```bash
$ yarn start-mock
```
This command will also start a fake api backend for helping development.
Once you happy with the result, save, build an image and run it with OpenDAX docker compose system.

## Execute tests

In `<rootDir>`

```bash
$ yarn test
```

For more options for `jest` run `yarn test --help`.

## Configuration documentation

Configuration file is located in  `public/config/env.js`


| Argument                 | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `api`    | URLs of `barong`, `peatio`, `applogic` and `ranger` API endpoints. You can use mockserver (<https://github.com/openware/mockserver>) with default `env.js` values |
| `minutesUntilAutoLogout`                |  Autologout time in minutes  |
| `withCredentials`               |  `false` or `true` if you want to include cookies as part of the request(https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)   |
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

## Licensing

This code is open for helping private modification and performing customer demonstration, you can use it for raising capital.
You cannot use it for a live platform without getting a commercial license from us.

Contact us if you'd like to purchase a commercial license.

## Partners

If you would like to fork, and modify this UI to create a BaseApp theme, we would be happy to setup a partnership program and sell your work provided a revenue sharing.

Made with love from Paris and Kiev.
