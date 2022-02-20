package db

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
}

func Connect(config Config) DB {
	db, err := sql.Open("postgres", config.ToString())
	if err != nil {
		log.Fatalln(err)
	}
	return DB{db}
}
