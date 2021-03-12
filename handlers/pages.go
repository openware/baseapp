package handlers

import (
	"html/template"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gomarkdown/markdown"
	"github.com/openware/baseapp/models"
)

// SetPageRoutes configure module HTTP routes
func SetPageRoutes(router *gin.Engine) error {
	ptr := models.Page{}
	for _, p := range ptr.List() {
		router.GET(p.Path, pageGet(&p))
	}
	return nil
}

func pageGet(p *models.Page) func(c *gin.Context) {
	return func(c *gin.Context) {
		body := string(markdown.ToHTML([]byte(p.Body), nil, nil))

		c.HTML(http.StatusOK, "page.html", gin.H{
			"title":       p.Title,
			"description": p.Description,
			"body":        template.HTML(body),
		})
	}
}
