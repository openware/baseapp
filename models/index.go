package models

import (
	"fmt"
	"github.com/openware/pkg/sonic/config"
	"io/ioutil"
	"log"

	"gorm.io/gorm"
)

// LoaderFunc is used to parse seed raw data into model type
type LoaderFunc func([]byte) (interface{}, error)

// MetaModel is holding Registry information
type MetaModel struct {
	Name   string
	Model  interface{}
	Loader LoaderFunc
}

// db pointer for sharing among models
var db *gorm.DB
var app *config.Runtime

// Models contains the list of registered models of the application
var registry = []MetaModel{}

// Setup used to assign `db` connection
// after connection is established on start server
func Setup(apr *config.Runtime) {
	app = apr
	db = apr.DB
}

// Register a model to the framework
func Register(name string, model interface{}, ptr LoaderFunc) {
	registry = append(registry, MetaModel{name, model, ptr})
}

// Migrate create and modify database tables according to the models
func Migrate() error {
	for _, meta := range registry {
		log.Printf("Migrating %s\n", meta.Name)
		if err := db.AutoMigrate(meta.Model); err != nil {
			return err
		}
	}
	return nil
}

// Seed execute all table seeding from yaml
func Seed() error {
	for _, meta := range registry {
		if err := readYamlSeed(meta); err != nil {
			return err
		}
	}
	return nil
}

// TODO: replace Loader function by reading from a map
func readYamlSeed(meta MetaModel) error {
	filename := fmt.Sprintf("config/seeds/%s.yml", meta.Name)
	raw, err := ioutil.ReadFile(filename)
	if err != nil {
		return err
	}
	list, err := meta.Loader(raw)
	if err != nil {
		return err
	}
	tx := db.CreateInBatches(list, 1000)
	return tx.Error
}
