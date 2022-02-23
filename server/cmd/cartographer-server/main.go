package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rs/cors"
	"susie.mx/cartographer/internal/db"
	"susie.mx/cartographer/internal/models"
)

const noId = -1

func getId(url string) (int, error) {
	tokens := strings.Split(url, "/")
	idStr := tokens[2]
	if idStr == "" {
		return noId, nil
	}
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
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if id != noId {
			switch req.Method {
			case http.MethodGet:
				mapImage, err := db.GetMapImage(id)
				if err != nil {
					log.Println(err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
				encoder := json.NewEncoder(w)
				err = encoder.Encode(mapImage)
				if err != nil {
					log.Println(err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
			case http.MethodPut:
				var updatedMapImage models.MapImage
				decoder := json.NewDecoder(req.Body)
				err := decoder.Decode(&updatedMapImage)
				if err != nil {
					log.Println(err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
				updatedMapImage, err = db.UpdateMapImage(id, updatedMapImage)
				if err != nil {
					log.Println(err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
				encoder := json.NewEncoder(w)
				err = encoder.Encode(updatedMapImage)
				if err != nil {
					log.Println(err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
			case http.MethodDelete:
				err := db.DeleteMapImage(id)
				if err != nil {
					log.Println(err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
			}
		} else {
			switch req.Method {
			case http.MethodGet:
				mapImages, err := db.GetMapImages()
				if err != nil {
					log.Println(err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
				encoder := json.NewEncoder(w)
				err = encoder.Encode(mapImages)
				if err != nil {
					log.Println(err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
			case http.MethodPost:
				newMapImage, err := db.CreateMapImage()
				if err != nil {
					log.Println(err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
				encoder := json.NewEncoder(w)
				err = encoder.Encode(newMapImage)
				if err != nil {
					log.Println(err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
			}
		}
	}
}

func main() {
	db := db.Connect(db.LoadFromEnv())
	mux := http.NewServeMux()
	mux.HandleFunc("/maps/", mapsHandler(db))

	c := cors.New(cors.Options{
		AllowedMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
	})

	handler := c.Handler(mux)
	http.ListenAndServe(":8090", handler)
}
