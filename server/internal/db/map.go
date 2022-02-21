package db

import "log"

type MapImage struct {
	Id      int    `json:"id"`
	DataUrl string `json:"dataUrl"`
}

func (db DB) CreateMapImage() MapImage {
	var id int
	err := db.QueryRow("INSERT INTO maps (dataurl) VALUES('') RETURNING id").Scan(&id)
	if err != nil {
		log.Fatalln(err)
	}
	return MapImage{
		Id: id,
	}
}

func (db DB) GetMapImage(id int) MapImage {
	var dataUrl string
	err := db.QueryRow("SELECT (dataurl) FROM maps WHERE id = $1", id).Scan(&dataUrl)
	if err != nil {
		log.Fatalln(err)
	}
	return MapImage{
		Id:      id,
		DataUrl: dataUrl,
	}
}

func (db DB) GetMapImages() []MapImage {
	rows, err := db.Query("SELECT * FROM maps")
	if err != nil {
		log.Fatalln(err)
	}
	mapImages := []MapImage{}
	for rows.Next() {
		var id int
		var dataUrl string
		err := rows.Scan(&id, &dataUrl)
		if err != nil {
			log.Fatalln(err)
		}
		mapImage := MapImage{Id: id, DataUrl: dataUrl}
		mapImages = append(mapImages, mapImage)
	}
	return mapImages
}

func (db DB) UpdateMapImage(id int, newDataUrl string) MapImage {
	_, err := db.Exec("UPDATE maps SET dataurl = $1 WHERE id = $2", newDataUrl, id)
	if err != nil {
		log.Fatalln(err)
	}
	return MapImage{
		Id:      id,
		DataUrl: newDataUrl,
	}
}
