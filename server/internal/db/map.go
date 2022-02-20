package db

import "log"

type MapImage struct {
	Id    int
	Bytes []byte
}

func (db DB) GetMapImage(id int) MapImage {
	var bytes []byte
	err := db.QueryRow("SELECT (bytes) FROM maps WHERE id = $1", id).Scan(&bytes)
	if err != nil {
		log.Fatalln(err)
	}
	return MapImage{
		Id:    id,
		Bytes: bytes,
	}
}

func (db DB) UpdateMapImage(id int, newBytes []byte) MapImage {
	_, err := db.Exec("UPDATE maps SET bytes = $1 WHERE id = $2", newBytes, id)
	if err != nil {
		log.Fatalln(err)
	}
	return MapImage{
		Id:    id,
		Bytes: newBytes,
	}
}
