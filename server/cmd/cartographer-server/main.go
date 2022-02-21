package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rs/cors"
	"susie.mx/cartographer/internal/db"
)

func getId(url string) (int, error) {
	tokens := strings.Split(url, "/")
	idStr := tokens[2]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return 0, fmt.Errorf("id is not a string: %s", err)
	}
	return id, nil
}

func mapsHandler(db db.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		log.Println(fmt.Sprintf("%s: %s", req.Method, req.URL))
		id, err := getId(req.URL.String())
		if err != nil {
			log.Println(err)
			return
		}
		switch req.Method {
		case "GET":
			mapImage := db.GetMapImage(id)
			w.Write(mapImage.Bytes)
		case "POST":
			mapBytes, err := ioutil.ReadAll(req.Body)
			if err != nil {
				log.Println(err)
				return
			}
			db.UpdateMapImage(id, mapBytes)
		}
	}
}

func main() {
	db := db.Connect(db.LoadFromEnv())
	mux := http.NewServeMux()
	mux.HandleFunc("/maps/", mapsHandler(db))
	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":8090", handler)
}
