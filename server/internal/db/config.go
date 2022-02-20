package db

import (
	"fmt"

	"susie.mx/cartographer/internal/utils"
)

type Config struct {
	host     string
	port     int
	user     string
	password string
	dbName   string
}

func LoadFromEnv() Config {
	return Config{
		host:     utils.GetStrEnvVar("DB_HOST", "localhost"),
		port:     utils.GetIntEnvVar("DB_PORT", 5432),
		user:     utils.MustGetStrEnvVar("DB_USER"),
		password: utils.MustGetStrEnvVar("DB_PASS"),
		dbName:   utils.MustGetStrEnvVar("DB_NAME"),
	}
}

func (c Config) ToString() string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		c.host, c.port, c.user, c.password, c.dbName)
}
