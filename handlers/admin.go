package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/openware/kaigara/pkg/vault"
)

// SetSecret handles PUT '/api/v2/admin/secret'
func SetSecret(ctx *gin.Context) {
	vaultConfig, err := GetVaultConfig(ctx)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	appName := ctx.Param("component")
	vaultService := vault.NewService(vaultConfig.Addr, vaultConfig.Token, appName, DeploymentID)

	key := ctx.PostForm("key")
	value := ctx.PostForm("value")
	scope := ctx.PostForm("scope")

	if key == "" || value == "" || scope == "" {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": "param missing (key, value or scope)"})
		return
	}

	vaultService.LoadSecrets(scope)
	err = vaultService.SetSecret(key, value, scope)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = vaultService.SaveSecrets(scope)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	result, err := vaultService.GetSecret(key, scope)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, result)
}

// GetSecrets handles GET '/api/v2/admin/secrets'
func GetSecrets(ctx *gin.Context) {
	vaultConfig, err := GetVaultConfig(ctx)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// Initialize the VaultService without an appName since we'll use all of them
	vaultService := vault.NewService(vaultConfig.Addr, vaultConfig.Token, "global", DeploymentID)
	scopes := []string{"public", "private", "secret"}

	appNames, err := vaultService.ListAppNames()
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	result := make(map[string]map[string]interface{})

	for _, app := range appNames {
		vaultService.SetAppName(app)

		result[app] = make(map[string]interface{})

		for _, scope := range scopes {
			if err := vaultService.LoadSecrets(scope); err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			result[app][scope] = make(map[string]interface{})

			if scope == "secret" {
				secretsKeys, err := vaultService.ListSecrets(scope)
				if err != nil {
					ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}

				for _, key := range secretsKeys {
					result[app][scope].(map[string]interface{})[key] = "******"
				}
			} else {
				secrets, err := vaultService.GetSecrets(scope)
				if err != nil {
					ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}

				result[app][scope] = secrets
			}

		}
	}

	ctx.JSON(http.StatusOK, result)
}
