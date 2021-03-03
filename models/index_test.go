package models

import (
	"github.com/openware/sonic"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func InitTestDB() {
	dial := sqlite.Open(":memory:?parseTime=True")
	db, err := gorm.Open(dial, &gorm.Config{})
	if err != nil {
		panic(err)
	}

	Setup(&sonic.Runtime{
		DB: db,
	})
	Migrate()
}
