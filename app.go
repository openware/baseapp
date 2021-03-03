package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/openware/pkg/database"
	"github.com/openware/pkg/ika"
	"github.com/openware/pkg/kli"
	"github.com/openware/sonic"
	"baseapp/handlers"
	"baseapp/models"
)

// Version of the application displayed by the cli and the version endpoint
var Version = "1.0.0"

// App config for the application
var App sonic.Runtime

func serve() error {
	App.Srv = gin.Default()
	handlers.Setup(&App)
	App.Srv.Run(":" + App.Conf.Port)
	return nil
}

// boot is executed before commands
func boot() error {
	var err error
	App.DB, err = database.Connect(&App.Conf.Database)
	if err != nil {
		log.Fatal(err)
	}
	App.Version = Version
	models.Setup(&App)
	return models.Migrate()
}

func main() {
	// Create new cli
	cnf := "config/app.yml"
	cli := kli.NewCli("sonic", "Fullstack micro application", Version)
	cli.StringFlag("config", "Application yaml configuration file", &cnf)

	dbCmd := cli.NewSubCommand("db", "Database commands")
	dbCmd.NewSubCommand("create", "Create database").Action(func() error {
		return database.Create(App.DB, App.Conf.Database.Name)
	})
	dbCmd.NewSubCommand("drop", "Drop database").Action(func() error {
		return database.Drop(App.DB, App.Conf.Database.Name)
	})
	dbCmd.NewSubCommand("migrate", "Run database migration").Action(boot)
	dbCmd.NewSubCommand("seed", "Run database seeding").Action(func() error {
		return models.Seed()
	})

	serveCmd := cli.NewSubCommand("serve", "Run the application")
	serveCmd.Action(serve)

	// FIXME: Some issues with ika usage:
	// 1. Can I use env only? Do I specify some magic path for that?
	// 2. If I have same config, in env and yaml, what do I get?
	// 3. What about more controllable usage, like
	//
	// type Source interface {
	//   func Load(config interface{}) error
	// }
	//
	// ReadConfig(cfg interface{}, configSource ...Source) error
	//
	// configs override from left to right
	// ika.ReadConfig(
	// 	&App.Conf,
	// 	ika.FileSource(jsonPath, ika.DecoderForFile(path)), - autodetect for json / yaml
	// 	ika.FileSource(tomlPath, tomlDecoder),
	// 	ika.EnvSource(),
	// 	myCustomSource, - f.e., config from vault
	// );
	//
	// read configuration from the file and environment variables
	if err := ika.ReadConfig(cnf, &App.Conf); err != nil {
		log.Fatalf("Error: %v\n", err)
	}

	// FIXME:
	// We need to change logic here
	// If database doesn't exist - you can not create it, because boot() will run migrations and raise an error.
	//
	// Due to mysql compose config - opendax_development exists by default and we don't face this issue if we just started mysql.
	if err := boot(); err != nil {
		log.Fatalf("Error: %v\n", err)
	}
	if err := cli.Run(); err != nil {
		log.Fatalf("Run: %v\n", err)
	}
}
