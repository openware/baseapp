# Go-Gin web application

This application was generated with [sonic](https://github.com/openware/sonic)

# How to run sonic with client

1. Run makefile
```
make asset
```
It will run build in the web folder and then all build files will be moved to public/assets.
#### **Be sure that you build your web (frontend) to the build folder, if it's another folder you can update your client (frontend) or makefile**

2. Start db, redis and vault
```
docker-compose -f config/backend.yml up -Vd
```

3. Create db
```
docker-compose -f config/backend.yml exec db bash
mysql
create database opendax_development;
exit
exit
```

4. Set up vault
```
docker-compose -f config/backend.yml exec vault sh
vault login changeme
vault secrets enable transit
vault secrets enable kv
```

5. Run go server
```
go run app.go serve
```

# Troubleshooting
**If it doesn't work and you see the white screen, check the order of the import files in index.html**