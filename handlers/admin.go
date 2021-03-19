package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"path"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/openware/pkg/jwt"
	"github.com/openware/pkg/mngapi/peatio"
	"github.com/openware/rango/pkg/auth"
	"github.com/openware/baseapp/daemons"
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
	PID    string `json:"pid"`
	KID    string `json:"kid"`
	Secret string `json:"secret"`
}

type setSecretParams struct {
	Key   string      `json:"key" binding:"required"`
	Value interface{} `json:"value" binding:"required"`
	Scope string      `json:"scope" binding:"required"`
}

// SetSecret handles PUT '/api/v2/admin/secret'
func SetSecret(ctx *gin.Context) {
	// Get global vault service
	vaultService, err := GetVaultService(ctx)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	var params setSecretParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	appName := ctx.Param("component")

	if err := vaultService.LoadSecrets(appName, params.Scope); err != nil {
		log.Printf("ERR: LoadSecrets: %s", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = vaultService.SetSecret(appName, params.Key, params.Value, params.Scope)
	if err != nil {
		log.Printf("ERR: SetSecret: %s", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = vaultService.SaveSecrets(appName, params.Scope)
	if err != nil {
		log.Printf("ERR: SaveSecrets: %s", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, "Secret saved successfully")
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

func registerPlatform(auth *jwt.Auth, params *CreatePlatformParams, odaxUrl *url.URL) (*CreatePlatformResponse, []byte, error) {
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
		return nil, nil, err
	}

	// Create new HTTP request
	req, err := http.NewRequest(http.MethodPost, odaxUrl.String(), bytes.NewBuffer(jsonPayload))
	if err != nil {
		return nil, nil, err
	}

	// Add request header
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/json")

	// Call HTTP request
	httpClient := &http.Client{Timeout: RequestTimeout}
	res, err := httpClient.Do(req)
	if err != nil {
		return nil, nil, err
	}
	defer res.Body.Close()

	// Convert response body to []byte
	resBody, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, nil, err
	}

	// Check for API error
	if res.StatusCode != http.StatusCreated {
		return nil, nil, fmt.Errorf("ERR: registerPlatform: Unexpected response from opendax.cloud: %s", resBody)
	}

	// Get platform from response
	platform := &CreatePlatformResponse{}
	err = json.Unmarshal(resBody, platform)
	if err != nil {
		return nil, nil, err
	}

	return platform, resBody, nil
}

func createOpendaxEngine(sc *SonicContext, auth *jwt.Auth, params *CreatePlatformParams, platform *CreatePlatformResponse, odaxUrl *url.URL) (string, error) {
	// Get engines by name
	engines, apiError := sc.PeatioClient.GetEngines(peatio.GetEngineParams{Name: "opendax-cloud-engine"})
	if apiError != nil {
		log.Printf("ERROR: Failed to get engine by name. Error: %v. Errors: %v", apiError.Error, apiError.Errors)
		return "", fmt.Errorf(apiError.Error)
	}

	var engineID string
	if len(engines) > 0 {
		// Update engine
		engineID = fmt.Sprint(engines[0].ID)
		engineParams := peatio.UpdateEngineParams{
			ID:     engineID,
			Name:   "opendax-cloud-engine",
			Driver: "opendax",
			UID:    auth.UID,
			URL:    fmt.Sprintf("wss://%v/api/v2/open_finance", odaxUrl.Host),
			State:  1, // state online
			Key:    platform.KID,
			Secret: platform.Secret,
		}

		_, apiError := sc.PeatioClient.UpdateEngine(engineParams)
		if apiError != nil {
			log.Printf("ERROR: Failed to update engine. Error: %v. Errors: %v", apiError.Error, apiError.Errors)
			return "", fmt.Errorf(apiError.Error)
		}
	} else {
		// Create engine
		engineParams := peatio.CreateEngineParams{
			Name:   "opendax-cloud-engine",
			Driver: "opendax",
			UID:    auth.UID,
			URL:    fmt.Sprintf("wss://%v/api/v2/open_finance", odaxUrl.Host),
			State:  1, // state online
			Key:    platform.KID,
			Secret: platform.Secret,
		}

		engine, apiError := sc.PeatioClient.CreateEngine(engineParams)
		if apiError != nil {
			log.Printf("ERROR: Failed to create engine. Error: %v. Errors: %v", apiError.Error, apiError.Errors)
			return "", fmt.Errorf(apiError.Error)
		}

		engineID = fmt.Sprint(engine.ID)
	}
	return engineID, nil
}

func createMarkets(sc *SonicContext, engineID string) error {
	// Get list of markets
	markets, apiError := sc.PeatioClient.GetMarkets()
	if apiError != nil {
		log.Printf("ERROR: Failed to get market list. Error: %v. Errors: %v", apiError.Error, apiError.Errors)
		return fmt.Errorf(apiError.Error)
	}

	// Update markets with new engine
	for _, market := range markets {
		marketParams := peatio.UpdateMarketParams{
			ID:       market.ID,
			EngineID: engineID,
		}

		_, apiError := sc.PeatioClient.UpdateMarket(marketParams)
		if apiError != nil {
			log.Printf("ERROR: Failed to update market. Error: %v. Errors: %v", apiError.Error, apiError.Errors)
			return fmt.Errorf(apiError.Error)
		}
	}
	return nil
}

func checkBalance(platform *CreatePlatformResponse, odaxUrl *url.URL) error {
	// Create new HTTP request
	peatioUrl := fmt.Sprintf("https://%v/api/v2/peatio/account/balances", odaxUrl.Host)
	req, err := http.NewRequest(http.MethodGet, peatioUrl, nil)
	if err != nil {
		return err
	}

	nonce := time.Now().UnixNano() / int64(time.Millisecond)
	req.Header = auth.NewAPIKeyHMAC(platform.KID, platform.Secret).GetSignedHeader(nonce)

	// Call HTTP request
	httpClient := &http.Client{Timeout: RequestTimeout}
	res, err := httpClient.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	// Convert response body to []byte
	resBody, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}

	// Check for API error
	if res.StatusCode != http.StatusOK {
		return fmt.Errorf("ERR: checkBalance: Unexpected response from opendax.cloud: %s", resBody)
	}

	return nil
}

// CreatePlatform to handler '/api/v2/admin/platforms/new'
func CreatePlatform(ctx *gin.Context) {
	// Get Opendax config
	opendaxConfig, err := GetOpendaxConfig(ctx)
	if err != nil {
		log.Printf("ERROR: %s", err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Get global vault service
	vaultService, err := GetVaultService(ctx)
	if err != nil {
		log.Printf("ERROR: global vault service not found: %s", err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Get auth
	auth, err := GetAuth(ctx)
	if err != nil {
		log.Printf("WARN: %s", err.Error())
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Allow only "superadmin" to create new platform
	if auth.Role != "superadmin" {
		log.Printf("WARN: %s is not superadmin %s", auth.Role, err.Error())
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Get Opendax API endpoint from config
	odaxUrl, err := url.Parse(opendaxConfig.Addr)
	if err != nil {
		log.Printf("ERR: CreatePlatform: OpenDAX URL parsing failed: %s", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	odaxUrl.Path = path.Join(odaxUrl.Path, "/api/v2/opx/platforms/new")

	// Get request parameters
	params := &CreatePlatformParams{}

	if err := ctx.ShouldBindJSON(&params); err != nil {
		log.Printf("ERROR: %s", err.Error())
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	// Register the platform
	platform, resBody, err := registerPlatform(auth, params, odaxUrl)
	if err != nil {
		log.Printf("ERROR: %s", err.Error())
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
		log.Printf("ERROR: Failed to store Platform ID in vault: %s", err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Save secret to vault
	err = vaultService.SaveSecrets(app, scope)
	if err != nil {
		log.Printf("ERROR: Failed to store secrets: %s", err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Retrieve a finex license
	err = daemons.CreateNewLicense("finex", opendaxConfig, vaultService)
	if err != nil {
		log.Printf("ERROR: Failed to retrieve a finex license: %s", err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Get Sonic Context
	sc, err := GetSonicCtx(ctx)
	if err != nil {
		log.Printf("ERROR: Can't get sonic context: %s", err.Error())
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// Check balance (this API call creates member on peatio)
	balanceErr := checkBalance(platform, odaxUrl)
	if balanceErr != nil {
		log.Printf("ERROR: Failed to get member balance: %s", balanceErr.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": balanceErr.Error()})
		return
	}

	// Manage engines
	engineID, err := createOpendaxEngine(sc, auth, params, platform, odaxUrl)
	if err != nil {
		log.Printf("ERROR: Failed to create opendax engine: %s", err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Manage markets
	err = createMarkets(sc, engineID)
	if err != nil {
		log.Printf("ERROR: Failed to create markets: %s", err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, resBody)
}
