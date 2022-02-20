package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/rs/cors"
	"susie.mx/cartographer/internal/db"
)

func mapsHandler(db db.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		log.Println(fmt.Sprintf("%s: %s", req.Method, req.URL))
		switch req.Method {
		case "GET":
			mapImage := db.GetMapImage(5)
			w.Write(mapImage.Bytes)
		case "POST":
			mapBytes, err := ioutil.ReadAll(req.Body)
			if err != nil {
				log.Println(err)
				return
			}
			db.UpdateMapImage(5, mapBytes)
		}
	}
}

func main() {
	db := db.Connect(db.LoadFromEnv())
	mux := http.NewServeMux()
	mux.HandleFunc("/maps", mapsHandler(db))
	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":8090", handler)
}
