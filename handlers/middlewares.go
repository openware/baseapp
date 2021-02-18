package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/openware/sonic"
)

// VaultConfigMiddleware middleware to set Vault config to gin context
func VaultConfigMiddleware(conf *sonic.VaultConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("VaultConfig", conf)
		c.Next()
	}
}
