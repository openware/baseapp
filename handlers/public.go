package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetPublicConfigs returns public configs
func GetPublicConfigs(ctx *gin.Context) {
	memoryCache.Mutex.RLock()
	ctx.JSON(http.StatusOK, memoryCache.Data)
	memoryCache.Mutex.RUnlock()
}
