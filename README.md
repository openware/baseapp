# Go-Gin web application

This application was generated with [sonic](https://github.com/openware/sonic)

## Prerequisites

To bring up all the dependencies, run `docker-compose up -Vd`

[Optional] To load the Vault policy and create a token, follow these steps:
1. Open `config/sonic.hcl` and substitute `deployment_id` with your actual deployment ID
2. Run
```sh
export VAULT_ADDR=http://localhost:8200
export VAULT_TOKEN=*changeme*
vault policy write *deployment_id*_sonic config/sonic.hcl
vault token create -policy *deployment_id*_sonic -period=768h
```
3. Use the resulting Vault token when running the application

## How to run Sonic with a frontend

1. Copy your frontend application source files to the `client/` folder

2. Use the Makefile:
```
make asset
```
This will run the build command in `client/` and move the build output to `public/assets/`.

**Warning**: Make sure to build your client (frontend) into the `build/` folder, if it's a different folder, you **must** update your client (frontend) or Makefile

3. Start the go server
```
go run app.go serve
```

## Troubleshooting
**If it doesn't work and you see the white screen, check the order of import files in index.html**
