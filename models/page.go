package models

import (
	"errors"
	"github.com/openware/pkg/sonic/models"
	"log"

	"github.com/openware/pkg/database"
	"gopkg.in/yaml.v2"
	"gorm.io/gorm"
)

func init() {
	Register("pages", &Page{}, func(rawYaml []byte) (interface{}, error) {
		list := []Page{}
		err := yaml.Unmarshal(rawYaml, &list)
		return list, err
	})
}

// Page : Table name is `Pages`
type Page struct {
	ID          uint   `gorm:"primarykey"`
	Path        string `gorm:"uniqueIndex;size:64;not null" yaml:"path"`
	Lang        string `yaml:"lang"`
	Title       string `yaml:"title"`
	Description string `yaml:"description"`
	Body        string `yaml:"body"`
	database.Timestamps
}

func (p *Page) GetPath() string {
	return p.Path
}

func (p *Page) GetBody() string {
	return p.Body
}

func (p *Page) GetTitle() string {
	return p.Title
}

func (p *Page) GetDescription() string {
	return p.Description
}

// FIXME: page methods will not look nice. Rails has modules, and in Go
// it's better to create some service abstraction or transform to a regular function.

// FindByPath find and return a page by path
func (p *Page) FindByPath(path string) *Page {
	page := Page{}
	tx := db.Where("path = ?", path).First(&page)

	if tx.Error != nil {
		if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
			return nil
		}
		log.Fatalf("FindPageByPath failed: %s", tx.Error.Error())
		return nil
	}
	return &page
}
func (p *Page) Transform() models.IPage {
	return p
}

// List returns all pages
func (p *Page) List() []models.IPage {
	var pages []Page
	tx := db.Find(&pages)

	if tx.Error != nil {
		log.Fatalf("FindPageByPath failed: %s", tx.Error.Error())
	}
	allPages := make([]models.IPage, len(pages))
	for idx, ent := range pages {
		allPages[idx] = ent.Transform()
	}
	return allPages
}
