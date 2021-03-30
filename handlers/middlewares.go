package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/openware/kaigara/pkg/vault"
	"github.com/openware/pkg/jwt"
	"github.com/openware/sonic"
)

// SonicContextMiddleware middleware to set sonic config to gin context
func SonicContextMiddleware(ctx *SonicContext) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("sctx", ctx)
		c.Next()
	}
}

// OpendaxConfigMiddleware middleware to set kaigara config to gin context
func OpendaxConfigMiddleware(config *sonic.OpendaxConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("OpendaxConfig", config)
		c.Next()
	}
}

// VaultServiceMiddleware middleware to set global vault service to gin context
func VaultServiceMiddleware(vaultService *vault.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("VaultService", vaultService)
		c.Next()
	}
}

// AuthMiddleware middleware to verify bearer token
func AuthMiddleware() gin.HandlerFunc {
	// Load public key
	keyStore := jwt.KeyStore{}
	err := keyStore.LoadPublicKeyFromString(BarongPublicKey)
	if err != nil {
		panic(err)
	}

	return func(c *gin.Context) {
		// Get bearer token from header
		authHeader := strings.Split(c.GetHeader("Authorization"), "Bearer ")
		if len(authHeader) != 2 {
			c.Abort()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Authorization header not found"})
			return
		}

		// Parse token
		jwtToken := authHeader[1]
		auth, err := jwt.ParseAndValidate(jwtToken, keyStore.PublicKey)
		if err != nil {
			c.Abort()
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		// Save auth data to gin context
		c.Set("auth", &auth)

		c.Next()
	}
}

// RBACMiddleware middleware to verity admin role
func RBACMiddleware(roles []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		auth, err := GetAuth(c)
		if err != nil {
			c.Abort()
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		if !isInRole(auth.Role, roles) {
			c.Abort()
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		c.Next()
	}
}

func isInRole(role string, roles []string) bool {
	for _, v := range roles {
		if v == role {
			return true
		}
	}

	return false
}
