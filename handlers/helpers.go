package handlers

import (
	"fmt"
	"log"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/openware/kaigara/pkg/vault"
	"github.com/openware/pkg/jwt"
	"github.com/openware/sonic"
)

type cache struct {
	Mutex sync.RWMutex
	Data  map[string]interface{}
}

// GetOpendaxConfig helper return kaigara config from gin context
func GetOpendaxConfig(ctx *gin.Context) (*sonic.OpendaxConfig, error) {
	config, ok := ctx.MustGet("OpendaxConfig").(*sonic.OpendaxConfig)
	if !ok {
		return nil, fmt.Errorf("Opendax config is not found")
	}

	return config, nil
}

// GetAuth helper return auth from gin context
func GetAuth(ctx *gin.Context) (*jwt.Auth, error) {
	auth, ok := ctx.MustGet("auth").(*jwt.Auth)
	if !ok {
		return nil, fmt.Errorf("Auth is not found")
	}

	return auth, nil
}

// GetVaultService helper return global vault service from gin context
func GetVaultService(ctx *gin.Context) (*vault.Service, error) {
	vaultService, ok := ctx.MustGet("VaultService").(*vault.Service)
	if !ok {
		return nil, fmt.Errorf("Global vault service is not found")
	}

	return vaultService, nil
}

// WriteCache read latest vault version and fetch keys values from vault
// 'firstRun' variable will help to run writing to cache on first system start
// as on the start latest and current versions are the same
func WriteCache(vaultService *vault.Service, scope string, firstRun bool) {
	err := vaultService.LoadSecrets("global", scope)
	if err != nil {
		panic(err)
	}

	if memoryCache.Data == nil {
		memoryCache.Data = make(map[string]interface{})
	}

	current, err := vaultService.GetCurrentVersion("global", scope)
	if err != nil {
		panic(err)
	}

	latest, err := vaultService.GetLatestVersion("global", scope)
	if err != nil {
		panic(err)
	}

	if current != latest || firstRun {
		log.Println("Writing to cache")
		keys, err := vaultService.ListSecrets("global", scope)
		if err != nil {
			panic(err)
		}

		for _, key := range keys {
			val, err := vaultService.GetSecret("global", key, scope)
			if err != nil {
				panic(err)
			}
			memoryCache.Data[key] = val
		}
	}
}
