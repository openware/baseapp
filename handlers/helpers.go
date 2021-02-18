package handlers

import (
	"fmt"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/openware/kaigara/pkg/vault"
	"github.com/openware/sonic"
)

type cache struct {
	Mutex sync.RWMutex
	Data  map[string]map[string]interface{}
}

// GetVaultConfig helper returns Vault config from gin context
func GetVaultConfig(ctx *gin.Context) (*sonic.VaultConfig, error) {
	config, ok := ctx.MustGet("VaultConfig").(*sonic.VaultConfig)
	if !ok {
		return nil, fmt.Errorf("Vault config is not found")
	}

	return config, nil
}

// WriteCache read latest vault version and fetch keys values from vault
// 'firstRun' variable will help to run writing to cache on first system start
// as on the start latest and current versions are the same
func WriteCache(vaultService *vault.Service, scope string, firstRun bool) {
	appNames, err := vaultService.ListAppNames()
	if err != nil {
		panic(err)
	}

	for _, app := range appNames {
		vaultService.SetAppName(app)
		err = vaultService.LoadSecrets(scope)
		if err != nil {
			panic(err)
		}

		if memoryCache.Data[app] == nil {
			memoryCache.Data[app] = make(map[string]interface{})
		}

		if memoryCache.Data[app][scope] == nil {
			memoryCache.Data[app][scope] = make(map[string]interface{})
		}

		current, err := vaultService.GetCurrentVersion(scope)
		if err != nil {
			panic(err)
		}

		latest, err := vaultService.GetLatestVersion(scope)
		if err != nil {
			panic(err)
		}

		if current != latest || firstRun {
			keys, err := vaultService.ListSecrets(scope)
			if err != nil {
				panic(err)
			}

			for _, key := range keys {
				val, err := vaultService.GetSecret(key, scope)
				if err != nil {
					panic(err)
				}
				memoryCache.Data[app][scope].(map[string]interface{})[key] = val
			}
		}
	}
}
