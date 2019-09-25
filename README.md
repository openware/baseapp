[![Build Status](https://ci.microkube.com/api/badges/openware/baseapp/status.svg)](https://ci.microkube.com/openware/baseapp)

Base Crypto Application
---

## Add npm token for install components library

```bash
$ echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" > .npmrc
```

## Export Tenko public key

```bash
export REACT_APP_TENKO_PUBLIC_KEY=LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBN0pXbit3RUVWcGk4RHFnVUZkeWdHTk5Hd3pOSzcycGVLWFBDWEtKVDg0WjZMcVpKCkRzKzdHeG5ma3FGWDRDckdzb0xYMzlrdmVwTlJLYitrbWM5elFuYjc0SXRJcDIzc3I4c252Nk5ERGplVjJtRjgKL0g4d29wclJOb3RDL2N3UXBrbHRXdHc0RlhRblNNMkhnZTU5cmdoa1k1TmVRVUJmSUt3UEt6YlNlSHpyak5GQgo4Q3F6aG1pcTdjRE9QeFJzcnR6K0EyNTNhU0hXdERJMTZuVm4ySXRjcHdtOStZbnFoYVRLMWNMYjZlcjdmRlhFCllYQ2t2VE9FZ2tkOHBYWm1waTJKaCtlYXVUN25VSmd2Z1F2TkI0T0dSZWtqMjllZThpclZwdG5waEZ3KzF4L0cKREE4UllkZkFKOU1IM1pBNVFzQlY4bUhsYmwydVNTc2UyWVZlMndJREFRQUJBb0lCQURQanB4SXdhT2t0V3FIRQpUNU56N2xGRGxaT2VubUxnYTRLZjl4TW1MMCtNUVNRV0tKUHREOWFqMkJ0cTg4RWc0SytxYnZxVHdnd2FYNFRPCm1hVjZrSWNWWGEwa0gyMUplTTRkdXJ3WGJNK2pkV1NPV1VGd0RCUzk3QUVRamtMb0RRYkx1QVpqb3BGaUJuTzcKVUdzNUNhdXYvNFN2Zjg3RDlabE80NHpRMjF5OWJVdlpMekluL3laYXVpVGJFMHc5aE5oaklLaGk0MzBFYTkwOQpSS3VWNDdDUW9BSmVZdERSTXk4N3pjbW9RUUtwY2Z0Z3Q0RkVXdTNzaEIrYk1ISXgvb2tlMlYrclZDUGhlRkl3ClptQlpBTHdDV3B6QjhQamRUN2JnakNGaklKTi9PQUtzVERVaDBONFFEZVdDTjJFMUp3K0RaVTRvNndTR1hLUDUKM3RHNjdrRUNnWUVBLzZ6UHBaRForQnFXOFdROVlrd2FrYnlwWUpJQlY3YmFFZ0s0bzd1MHpBcTlRWnlwS0FkYQo1Q2hxWmtkUVNScjFmK3BweE1iOFJtZDZUYVJEN0hlOXM0OFNWSEFWVHhPaW1iODltbURybzFqRWFjd2ljbDhNCnhGZlRIWU1DWFg2SktMd2hXZUp3UGwwakM3Uml3WmdnV1JMWXdZRFBTeU1uSGdYY2pKSXlybkVDZ1lFQTdPS2kKTThTOVVGZHlaYWpvaXpNdkg0MDRRem9DaEFvTW42ZVdpQlpGaE8ySmE1aFF2OWxrV1FlNUNmTDNVUnZzNHdmMApJOEgrdjRsWXVDRXJhOEFjZmxFL3RYNVNyRU1YeXlKSE94bkwzZS9OL1VDOUp1bHRqaCtweFAvOGFnZkFiaWpoClRpNUpRKzkrNGswdVNtblV2eFdiNko4T0phWU9Dd0RDaVJpRjRBc0NnWUJWWitDbEtkSGw4dHZoSHQ3eWF3R2wKRlNSdlFkWjQrbmUxOUhyQkZ2NjUrZ3htVW5LZkVIWG9LU2dCcW1qRFF1SW5MS0xRUExnZ3ZJZzZUMWp4TUw2SgpzSTBxNzVYdXFGeDBoMUdJdEQrQ2ZUQi9OdFY2NXcxWXVRMm9tZzY4Tkh5VXd1TlJKemJmWGpWS3Y2TU5rRWVkCitaRzJjZFROQUowY2hsQzZGRXdod1FLQmdDbDc0dlgzN1VObG5RWUtsM2JSSnQ1NnA3QzJOdnlTbWZWWHJ2ZjAKRm9hWjVxZnVDNjRkVHdKOFpMNUdTMk5yNVljNHZGdUt2S2NrVVdJbGhPb2d3WnlwYytPLzFKQ1FTMWxxamxqZQpRcUtDUFd1dGE3S2x6R2JJU3IzU0tvMFRBSE1LTzdLcVRuQlVQNzgzenZSL0poKzBsQklmMEtWdE9DWmJJclpKCmtpQlRBb0dCQUxrQm9pMlIxNlltM2RLamU1OE1TK2pKWXREYjBPcEFWRzBlcUgzU0lpMkF4bnMrcTZMcWpZZ0wKNndwSlJRWDUzQWRPd252NVl3STMra2lvWE0ydGpLdHh0cTBWbzVUY0hKeFRkdjRkRmRHV0g3UGZmQi9PUUVkawpQVWlYMHFmYktWWHBNb0g0RWM0aERhU05acmVTYlZoZHB5RWhHT0c2aEE2MDVSVnZGQnFqCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg==
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
