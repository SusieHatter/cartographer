package utils

import (
	"log"
	"os"
	"strconv"
)

func MustGetStrEnvVar(key string) string {
	value := os.Getenv(key)
	if value == "" {
		log.Fatalf("Required env var '%s' misisng", key)
	}
	return value
}

func GetStrEnvVar(key string, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func GetIntEnvVar(key string, defaultValue int) int {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	intValue, err := strconv.Atoi(value)
	if err != nil {
		return defaultValue
	}
	return intValue
}
