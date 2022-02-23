package db

import (
	"fmt"

	"susie.mx/cartographer/internal/models"
)

func (db DB) CreateMapImage() (models.MapImage, error) {
	var id int
	err := db.QueryRow("INSERT INTO maps (dataurl) VALUES('') RETURNING id").Scan(&id)
	if err != nil {
		return models.MapImage{}, fmt.Errorf("creating MapImage failed: %w", err)
	}
	return models.MapImage{
		Id: id,
	}, nil
}

func (db DB) GetMapImage(id int) (models.MapImage, error) {
	var dataUrl string
	err := db.QueryRow("SELECT (dataurl) FROM maps WHERE id = $1", id).Scan(&dataUrl)
	if err != nil {
		return models.MapImage{}, fmt.Errorf("getting MapImage(%d) failed: %w", id, err)
	}
	return models.MapImage{
		Id:      id,
		DataUrl: dataUrl,
	}, nil
}

func (db DB) GetMapImages() ([]models.MapImage, error) {
	rows, err := db.Query("SELECT * FROM maps ORDER BY id DESC")
	if err != nil {
		return nil, fmt.Errorf("getting MapImages failed: %w", err)
	}
	defer rows.Close()
	mapImages := []models.MapImage{}
	for rows.Next() {
		var id int
		var dataUrl string
		err := rows.Scan(&id, &dataUrl)
		if err != nil {
			return nil, fmt.Errorf("scanning MapImage row failed: %w", err)
		}
		mapImage := models.MapImage{Id: id, DataUrl: dataUrl}
		mapImages = append(mapImages, mapImage)
	}
	return mapImages, nil
}

func (db DB) UpdateMapImage(id int, updatedMapImage models.MapImage) (models.MapImage, error) {
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
		return models.MapImage{}, fmt.Errorf("update MapImage(%d) failed: %w", id, err)
	}
	return db.GetMapImage(id)
}

func (db DB) DeleteMapImage(id int) error {
	_, err := db.Exec("DELETE FROM maps WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("delete MapImage(%d) failed: %w", id, err)
	}
	return nil
}
