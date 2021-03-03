package handlers

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/url"
	"path"
	"time"

	"github.com/gin-gonic/gin"
)

const (
	// RequestTimeout default value to 30 seconds
	RequestTimeout = time.Duration(30 * time.Second)
)

// CreatePlatformParams from request parameter
type CreatePlatformParams struct {
	PlatformName string `json:"platform_name" binding:"required"`
	PlatformURL  string `json:"platform_url" binding:"required"`
}

// CreatePlatformResponse store response from new platform
type CreatePlatformResponse struct {
	PID string `json:"pid"`
}

// SetSecret handles PUT '/api/v2/admin/secret'
func SetSecret(ctx *gin.Context) {
	// Get global vault service
	vaultService, err := GetVaultService(ctx)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	key := ctx.PostForm("key")
	value := ctx.PostForm("value")
	scope := ctx.PostForm("scope")
	appName := ctx.Param("component")

	if key == "" || value == "" || scope == "" {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": "param missing (key, value or scope)"})
		return
	}

	vaultService.LoadSecrets(appName, scope)
	err = vaultService.SetSecret(appName, key, value, scope)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = vaultService.SaveSecrets(appName, scope)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	result, err := vaultService.GetSecret(appName, key, scope)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, result)
}

// GetSecrets handles GET '/api/v2/admin/secrets'
func GetSecrets(ctx *gin.Context) {
	// Get global vault service
	vaultService, err := GetVaultService(ctx)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	scopes := []string{"public", "private", "secret"}

	appNames, err := vaultService.ListAppNames()
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	result := make(map[string]map[string]interface{})

	for _, app := range appNames {
		result[app] = make(map[string]interface{})

		for _, scope := range scopes {
			if err := vaultService.LoadSecrets(app, scope); err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			result[app][scope] = make(map[string]interface{})

			if scope == "secret" {
				secretsKeys, err := vaultService.ListSecrets(app, scope)
				if err != nil {
					ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}

				for _, key := range secretsKeys {
					result[app][scope].(map[string]interface{})[key] = "******"
				}
			} else {
				secrets, err := vaultService.GetSecrets(app, scope)
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

// CreatePlatform to handler '/api/v2/admin/platforms/new'
func CreatePlatform(ctx *gin.Context) {
	// Get Opendax config
	opendaxConfig, err := GetOpendaxConfig(ctx)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// Get global vault service
	vaultService, err := GetVaultService(ctx)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// Get auth
	auth, err := GetAuth(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Allow only "superadmin" to create new platform
	if auth.Role != "superadmin" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Get request parameters
	var params CreatePlatformParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	// Get Opendax API endpoint from config
	url, err := url.Parse(opendaxConfig.Addr)
	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}
	url.Path = path.Join(url.Path, "/api/v2/opx/platforms/new")

	// Request payload
	payload := map[string]interface{}{
		"email":             auth.Email,
		"platform_name":     params.PlatformName,
		"platform_url":      params.PlatformURL,
		"sonic_public_key":  SonicPublicKey,
		"peatio_public_key": PeatioPublicKey,
		"barong_public_key": BarongPublicKey,
	}

	// Convert payload to json string
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	// Create new HTTP request
	req, err := http.NewRequest(http.MethodPost, url.String(), bytes.NewBuffer(jsonPayload))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Add request header
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/json")

	// Call HTTP request
	httpClient := &http.Client{Timeout: RequestTimeout}
	res, err := httpClient.Do(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer res.Body.Close()

	// Convert response body to []byte
	resBody, err := ioutil.ReadAll(res.Body)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Check for API error
	if res.StatusCode != http.StatusCreated {
		ctx.JSON(res.StatusCode, resBody)
		return
	}

	// Get platform from response
	platform := CreatePlatformResponse{}
	err = json.Unmarshal(resBody, &platform)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	app := "peatio"
	scope := "private"
	key := "platform_id"
	// Load secret
	vaultService.LoadSecrets(app, scope)

	// Set Platform ID to secret
	err = vaultService.SetSecret(app, key, platform.PID, scope)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Save secret to vault
	err = vaultService.SaveSecrets(app, scope)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, resBody)
}
