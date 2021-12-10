package handlers

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"

	"github.com/foolin/goview/supports/ginview"
	"github.com/gin-gonic/gin"
	"github.com/openware/baseapp/daemons"
	"github.com/openware/baseapp/models"
	"github.com/openware/kaigara/pkg/vault"
	"github.com/openware/pkg/mngapi/peatio"
	"github.com/openware/pkg/sonic/config"
	"github.com/openware/pkg/sonic/handlers"
	"github.com/openware/pkg/utils"
)

// Version variable stores Application Version from main package
var (
	Version      string
	DeploymentID string
)

// SonicContext stores requires client services used in handlers
type SonicContext struct {
	PeatioClient *peatio.Client
}

// Initialize scope which goroutine will fetch every 30 seconds
const scope = "public"

// Setup set up routes to render view HTML
func Setup(app *config.Runtime) {
	// Get config and env
	Version = app.Version
	DeploymentID = app.Conf.DeploymentID
	handlers.SonicPublicKey = utils.GetEnv("SONIC_PUBLIC_KEY", "")
	handlers.PeatioPublicKey = utils.GetEnv("PEATIO_PUBLIC_KEY", "")
	handlers.BarongPublicKey = utils.GetEnv("BARONG_PUBLIC_KEY", "")
	vaultConfig := app.Conf.Vault
	opendaxConfig := app.Conf.Opendax
	mngapiConfig := app.Conf.MngAPI

	peatioClient, err := peatio.New(mngapiConfig.PeatioURL, mngapiConfig.JWTIssuer, mngapiConfig.JWTAlgo, mngapiConfig.JWTPrivateKey)
	if err != nil {
		log.Printf("Can't create peatio client: " + err.Error())
		return
	}

	log.Println("DeploymentID in config:", app.Conf.DeploymentID)

	// Get app router
	router := app.Srv

	// Set up view engine
	router.HTMLRender = ginview.Default()

	// Serve static files
	router.Static("/public", "./public")

	router.GET("/", index)
	router.GET("/maintenance", maintenance)
	router.GET("/restriction", restriction)

	router.GET("/version", version)

	router.NoRoute(notFound)

	handlers.SetPageRoutes(router, &models.Page{})

	// React is looking for these files in root
	// TODO: find solution for react build (webpack)
	router.Static("/charting_library", "./public/assets/charting_library")
	router.Static("/css", "./public/assets/css")

	// Initialize Vault Service
	vaultService := vault.NewService(vaultConfig.Addr, vaultConfig.Token, DeploymentID)

	adminAPI := router.Group("/api/v2/admin")
	adminAPI.Use(handlers.VaultServiceMiddleware(vaultService))
	adminAPI.Use(handlers.OpendaxConfigMiddleware(&opendaxConfig))
	adminAPI.Use(handlers.AuthMiddleware())
	adminAPI.Use(handlers.RBACMiddleware([]string{"superadmin"}))
	adminAPI.Use(handlers.SonicContextMiddleware(&handlers.SonicContext{
		PeatioClient: peatioClient,
	}))

	adminAPI.GET("/secrets", handlers.GetSecrets)
	adminAPI.PUT(":component/secret", handlers.SetSecret)
	adminAPI.POST("/platforms/new", func(ctx *gin.Context) {
		handlers.CreatePlatform(ctx, daemons.CreateNewLicense, daemons.FetchConfiguration)
		return
	})

	publicAPI := router.Group("/api/v2/public")
	publicAPI.Use(handlers.VaultServiceMiddleware(vaultService))

	publicAPI.GET("/config", handlers.GetPublicConfigs)

	// Define all public env on first system start
	handlers.WriteCache(vaultService, scope, true)
	go handlers.StartConfigCaching(vaultService, scope)

	// Run LicenseRenewal
	go daemons.LicenseRenewal("finex", app, vaultService)

	// Fetch currencies and markets from the main platform periodically
	enabled, err := daemons.GetXLNEnabledFromVault(vaultService)
	if err != nil {
		log.Printf("cannot determine whether XLN is enabled: " + err.Error())
	}
	if enabled {
		go daemons.FetchConfigurationPeriodic(peatioClient, vaultService, opendaxConfig.Addr)
	}
}

// index render with master layer
func index(ctx *gin.Context) {
	var renderFooter, err = strconv.ParseBool(utils.GetEnv("RENDER_FOOTER", "false"))
	if err != nil {
		log.Println("renderFooter:", "should be true of false: "+err.Error())
	}

	cssFiles, err := FilesPaths("/public/assets/*.css")
	if err != nil {
		log.Println("filePaths:", "Can't take list of paths for css files: "+err.Error())
	}

	jsFiles, err := FilesPaths("/public/assets/*.js")
	if err != nil {
		log.Println("filePaths", "Can't take list of paths for js files in public folder: "+err.Error())
	}

	ctx.HTML(http.StatusOK, "index", gin.H{
		"title":        "BaseApp",
		"cssFiles":     cssFiles,
		"jsFiles":      jsFiles,
		"rootID":       "root",
		"renderFooter": renderFooter,
	})
}

func maintenance(ctx *gin.Context) {
	cssFiles, err := FilesPaths("/public/assets/*.css")
	if err != nil {
		log.Println("filePaths:", "Can't take list of paths for css files: "+err.Error())
	}

	jsFiles, err := FilesPaths("/public/assets/config.js")
	if err != nil {
		log.Println("filePaths", "Can't take path for config.js in public folder: "+err.Error())
	}

	ctx.HTML(http.StatusOK, "maintenance", gin.H{
		"title":    "Maintenance",
		"cssFiles": cssFiles,
		"jsFiles":  jsFiles,
	})
}

func restriction(ctx *gin.Context) {
	cssFiles, err := FilesPaths("/public/assets/*.css")
	if err != nil {
		log.Println("filePaths:", "Can't take list of paths for css files: "+err.Error())
	}

	jsFiles, err := FilesPaths("/public/assets/config.js")
	if err != nil {
		log.Println("filePaths", "Can't take path for config.js in public folder: "+err.Error())
	}

	ctx.HTML(http.StatusOK, "restriction", gin.H{
		"title":    "Restriction",
		"cssFiles": cssFiles,
		"jsFiles":  jsFiles,
	})
}

// Return application version
func version(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"Version": Version})
}

func notFound(ctx *gin.Context) {
	// Any file path other than .html will be invalid.
	invalidPath := regexp.MustCompile(`^\/?((?:\w+\/)*(\w*\.[^\.html]+))`)
	if invalidPath.MatchString(ctx.Request.RequestURI) {
		ctx.Status(http.StatusNotFound)
		return
	}
	log.Printf("Path %s not found, defaulting to index.html\n", ctx.Request.URL.Path)
	index(ctx)
}

func FilesPaths(pattern string) ([]string, error) {
	var matches []string

	fullPath, err := os.Getwd()
	if err != nil {
		return nil, err
	}

	matches, err = filepath.Glob(fullPath + pattern)
	if err != nil {
		return nil, err
	}

	for i := range matches {
		matches[i] = strings.Replace(matches[i], fullPath, "", -1)
	}

	return matches, nil
}
