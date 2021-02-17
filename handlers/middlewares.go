package handlers

import (
	"github.com/gin-gonic/gin"
	kaigara "github.com/openware/kaigara/pkg/config"
)

// KaigaraConfigMiddleware middleware to set kaigara config to gin context
func KaigaraConfigMiddleware(config *kaigara.KaigaraConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("KaigaraConfig", config)
		c.Next()
	}
}
