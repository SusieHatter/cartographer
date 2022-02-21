package db

import (
	"fmt"
	"log"

	"susie.mx/cartographer/internal/models"
)

func (db DB) CreateMapImage() models.MapImage {
	var id int
	err := db.QueryRow("INSERT INTO maps (dataurl) VALUES('') RETURNING id").Scan(&id)
	if err != nil {
		log.Fatalln(err)
	}
	return models.MapImage{
		Id: id,
	}
}

func (db DB) GetMapImage(id int) models.MapImage {
	var dataUrl string
	err := db.QueryRow("SELECT (dataurl) FROM maps WHERE id = $1", id).Scan(&dataUrl)
	if err != nil {
		log.Fatalln(err)
	}
	return models.MapImage{
		Id:      id,
		DataUrl: dataUrl,
	}
}

func (db DB) GetMapImages() []models.MapImage {
	rows, err := db.Query("SELECT * FROM maps ORDER BY id DESC")
	if err != nil {
		log.Fatalln(err)
	}
	defer rows.Close()
	mapImages := []models.MapImage{}
	for rows.Next() {
		var id int
		var dataUrl string
		err := rows.Scan(&id, &dataUrl)
		if err != nil {
			log.Fatalln(err)
		}
		mapImage := models.MapImage{Id: id, DataUrl: dataUrl}
		mapImages = append(mapImages, mapImage)
	}
	return mapImages
}

func (db DB) UpdateMapImage(id int, updatedMapImage models.MapImage) models.MapImage {
	queryString := "UPDATE maps SET "
	queryArgs := []interface{}{}
	numArgs := 0
	if updatedMapImage.DataUrl != "" {
		numArgs++
		queryString += fmt.Sprintf("dataurl = $%d ", numArgs)
		queryArgs = append(queryArgs, updatedMapImage.DataUrl)
	}
	queryString += fmt.Sprintf("WHERE id = $%d", numArgs+1)
	queryArgs = append(queryArgs, id)
	_, err := db.Exec(queryString, queryArgs...)
	if err != nil {
		log.Fatalln(err)
	}
	return db.GetMapImage(id)
}

func (db DB) DeleteMapImage(id int) {
	_, err := db.Exec("DELETE FROM maps WHERE id = $1", id)
	if err != nil {
		log.Fatalln(err)
	}
}
